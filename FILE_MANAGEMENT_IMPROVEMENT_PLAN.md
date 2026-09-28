# File Management Improvement Plan

> Status: IMPLEMENTED (2026-09-28). Covers two repos: `portfolio.app` (Next.js frontend, this repo) and `portfolio.api` (FastAPI backend, sibling folder).

## Implementation log

**Correction to §0 before implementing:** re-reading `upload_to_backblaze()` while implementing the fix showed the saved URL was built as `generate_presigned_url(...).split('?')[0]` — the presign signature is stripped *before* saving, so the stored URL never carried expiring auth in the first place. There is no rolling 1-hour expiry; the bucket has to already be effectively public-read for images to display at all (confirmed with you before proceeding). The real bug was fragility/waste (a pointless signing round-trip, a leftover debug `print`), not a time bomb. Since existing rows' URLs are already in this exact unsigned form, **no backfill/re-upload script was needed** — the open question about one is moot.

**Backend (`portfolio.api`)** — all of §2 done:
- `get_public_url()` replaces the presign-and-strip hack (still uses `generate_presigned_url` internally so boto3 picks the correct bucket addressing style, just documents *why* stripping the query string is safe here); debug `print` removed.
- Added `storage_key` column (migration `b7e2d5f8a1c3`) — the durable B2 object key, set on every upload.
- `DELETE /files/{id}` now calls `BackblazeService.delete_file_from_backblaze()` using `storage_key`, with a fallback to the old local-disk `os.remove` only for legacy rows that predate this column.
- `POST /files` now uploads through the same Backblaze path as bulk-upload (was local-disk-only).
- Removed the three dead, non-persisting endpoints (`/files/minio-upload`, `/files/firebase-upload`, `/files/backblaze-upload`).
- Re-enabled file replacement on `PATCH /files/{id}` (was fully commented out) — uploads the replacement, repoints the same `File` row, deletes the old object.
- Bonus fixes found while wiring the above: `as_form_factory()` mis-detected `Optional[UploadFile]` fields (compared `__origin__` to `typing.Optional`, which is never what `Optional[X].__origin__` actually is — fixed to compare against `typing.Union`), which would have silently broken the replace endpoint's file upload; and `upload_to_backblaze()` returned a stale pre-update dict (local-disk url) to its caller instead of the final Backblaze url.

**Frontend (`portfolio.app`)** — §4.1, 4.2, 4.4, 4.5 done; §4.3 done at reduced scope:
- New `FileDropzone` (§4.1): drag/drop + click, image preview, client-side type/size validation, per-file status (queued/uploading/done/error). Progress is a spinner, not a byte-accurate percentage — true `onUploadProgress` would need threading an axios config through every upload thunk, cut for time.
- `FileSelectField` (§4.2): added a "Choose existing / Upload new" toggle — uploading now auto-selects the result inline, instead of round-tripping through the Files browser.
- `FileCard` (§4.4): added **Replace** (drop a new file, same record updates in place) and fixed **Download** (was identical to View — now appends `response-content-disposition=attachment` so the browser actually saves it, since the HTML `download` attribute is silently ignored cross-origin). Added a **Broken** badge (§4.5) via a hidden probe `<img>`.
- `/admin/files` (§4.3): categories are now derived from the real `model_name` values in the data instead of a hardcoded Profile/Others pair; browsing a category shows a thumbnail grid (`FileCard variant="grid"`) instead of a text list, with multi-select + bulk delete. **Not done:** sub-grouping by `model_id` within a category (e.g. "Project: X") and drag-to-reorder via the existing `move_file_to_position` — cut for time, `position` is still only editable one field at a time.
- `ImageComponent` (§4.5): the fallback path pointed at `/images/no-image.png`, which doesn't exist in `public/` — a broken image was falling back to *another* broken image (the browser's native icon). Replaced with a built-in "Unavailable" placeholder.
- Retired `FormFileUpload` from every standalone upload-then-attach flow (certifications, projects, blog cover/files) in favor of `FileDropzone`. Deliberately **left in place** on the Profile page only, since that upload is submitted together with the rest of the profile form in one multipart PATCH, not a separate upload-then-attach step — converting it would change that page's save semantics, out of scope here.
- Deleted confirmed-dead code: `Gallery.tsx`, `CustomFileUpload.tsx`, and the three frontend thunks/service calls for the now-removed minio/firebase/backblaze-direct endpoints.

Verified with `tsc --noEmit`, `eslint` on every changed file, and `next build` (full route table, no new errors) after each chunk; backend verified by importing the full FastAPI app (104 routes, down from 107 — the three dead endpoints) and `alembic history`. No live DB/B2 access from this sandbox, so the migration itself still needs `alembic upgrade head` run against the real database, and the bucket's public-read setting needs confirming/setting on the B2 side (nothing on the Backblaze console can be done from here).

---

## 0. Headline finding

While inspecting the backend to scope the frontend work, I found what is very likely a **live, active bug already breaking images and files across the site right now**, independent of any frontend work. It's serious enough to lead with:

**Uploaded file URLs expire after 1 hour.**

Every real upload path in the app (Certification file, Project screenshots, Blog cover/files, and the admin Files page's "Add File") goes through the backend's `bulk-upload` endpoint, which uploads to Backblaze B2 and saves the file's permanent `url` column as the return value of:

```python
# api/utils/backblaze_service.py, upload_to_backblaze()
preview_url = cls.generate_presigned_url(
    object_name=destination,
    response_content_disposition="inline"
).split('?')[0]
...
File.update(db=db, id=new_file.get('id'), url=preview_url)
```

`generate_presigned_url` defaults to `expires_in=3600` (one hour) and is never called with a longer value here. That expiring, signed URL is then stored **permanently** in the `files.url` column, with nothing anywhere that ever refreshes it. So:

- Any skill logo, service icon, project screenshot, certification badge, or blog cover image uploaded more than an hour ago has a dead image URL.
- This is almost certainly the real root cause of the gallery bug you reported earlier in this session ("an image not showing, then other images in the gallery also start showing as broken"). I already fixed the *frontend symptom* (a stale `error` state in `ImageComponent` that leaked from one broken image to the next one shown in the same component instance — see `components/shared/Image.tsx`), but that fix only stops one broken image from **cascading** to others. It does nothing about images going broken **in the first place**, which this expiring-URL bug causes on a rolling 1-hour basis for every uploaded asset.

This is flagged in Backend §1 below as the top-priority fix, ahead of everything else in this document, including the UX work you actually asked for. Everything else in this plan is secondary to it.

---

## 1. How file upload/storage actually works today (as found)

There are **four** upload code paths in the backend, and the frontend only really uses two of them:

| Endpoint | Storage | Saves a `File` DB row? | Used by frontend? |
|---|---|---|---|
| `POST /files` (`createFile`) | Local disk (`filestorage/` folder, via `FileService.upload_file`) | Yes | Only by `components/shared/Gallery.tsx`, which is **dead code** (not rendered anywhere in the app) |
| `POST /files/bulk-upload` (`bulkUploadFile`) | Backblaze B2 (goes through the same local-disk write first, uploads to B2, then deletes the local copy) | Yes | **Yes — this is the one real path.** Used by the admin Files page ("Add File"), Certification "Upload Certification File", Project "Upload Project Files", Blog cover image and blog files |
| `POST /files/minio-upload` | MinIO | No (returns a bare URL, no DB row) | No |
| `POST /files/firebase-upload` | Firebase | No (returns a bare URL, no DB row) | No |
| `POST /files/backblaze-upload` | Backblaze B2 (direct) | No (returns a bare URL, no DB row) | No |

Consequences:

- **Two different storage backends are live in production for the same feature**, depending on which upload button you click. The one path that actually gets used (bulk-upload → Backblaze) has the expiring-URL bug above. The other real path (single `createFile` → local disk) would lose every file on the next deploy/restart if the backend runs on any ephemeral host (Railway, Render, Fly, most containers) — it only survives if the backend has a genuinely persistent disk. Since it's unused today (only reachable via dead code), it's a landmine rather than an active bug, but it's the same code that *would* run if anyone ever wires `Gallery.tsx` back up or copies its pattern for a new feature.
- Three of the five upload endpoints are **half-built experiments that don't persist anything** to the database. They're reachable (behind admin auth) but produce orphaned cloud objects with no tracking record if ever called.
- **Deleting a file never deletes it from Backblaze.** `DELETE /files/{id}` calls `os.remove(file.file_path)` unconditionally. For a Backblaze-origin file, `file_path` points to the *local temp file that was already deleted right after the upload finished* (per `delete_after_upload=True` in `upload_to_backblaze`), so this call does nothing useful (it throws, gets caught, and is logged) and `BackblazeService.delete_file_from_backblaze()` — which exists and works — is **never called from the delete route**. Every file you've ever deleted in the admin is still sitting in the B2 bucket today, and every future delete will keep leaking storage.
- **File replacement is disabled.** The `update_file` route's logic for swapping a file's actual binary content is fully commented out. Today, to replace a bad logo/screenshot you must delete the `File` record and create a new one, which orphans the `file_id` reference on whatever skill/service/award/etc. pointed at the old file until someone manually re-selects the new one in that record's edit form.
- **`file_path` no longer means anything reliable** once a file has gone through the Backblaze path — it's a dead local path. There's no column that stores the actual durable reference needed to manage the object in B2 later (the `destination`/object key used at upload time is computed and used once, then thrown away).

None of this needs the frontend redesign you asked for to be *visible* — it's a backend correctness problem. I've kept it separate from the UX plan below so you can decide independently whether to green-light it.

---

## 2. Backend recommendations (small, surgical — not a rewrite)

You said the backend probably doesn't need much. Based on what I found, I'd narrow that to: it needs a few precise, low-risk fixes, not new architecture. All of this stays inside the existing `FileService`/`BackblazeService`/`file` router; nothing here proposes a new storage provider or a schema redesign.

1. **Fix the URL expiry (priority 0).** Recommended fix: make the B2 bucket public-read (everything stored here is a public portfolio asset — project screenshots, logos, résumé, blog images — there is no private file in this app today) and store the **plain public object URL** instead of a presigned one. This removes the expiry problem entirely and is simpler than managing a refresh cycle. If the bucket must stay private for some reason, the fallback is a background job or on-read refresh that re-signs the URL before it expires, which is meaningfully more complex for no real benefit here — public-read is the right call unless you tell me otherwise.
2. **Make Backblaze the single upload path.** Point the plain `POST /files` (`create_file`) at the same Backblaze flow `bulk-upload` uses, instead of leaving it on local disk. One storage backend, one code path, used by both single- and multi-file forms.
3. **Delete from Backblaze on delete.** Call `BackblazeService.delete_file_from_backblaze()` in the `delete_file` route. Requires storing the B2 object key at upload time (see #5) so the delete route knows what to remove.
4. **Remove the three dead upload endpoints** (`/files/minio-upload`, `/files/firebase-upload`, `/files/backblaze-upload`) or gate them behind a clear "internal/experimental" marker. They don't persist anything and aren't reachable from the app; keeping them live just widens the admin-authenticated attack surface for no functional benefit.
5. **Store the durable storage key.** Add (or repurpose the currently-unused `external_url` column into) a `storage_key` field that holds the permanent B2 object key (`{app_name}/{model_name}/{model_id}/{filename}`), independent of the display `url`. This is what the delete fix in #3 needs, and it's also what would let a future "regenerate URL" action work without guessing the key back from the URL string.
6. **Re-enable file replacement** in `update_file`: accept a new file on the update payload, upload it to the same storage key (or a new one), update `url`/`file_size`, and clean up the old object. This directly enables the frontend "Replace file" action in §4 below.

None of this touches models unrelated to files, doesn't change the `File` table's shape in a breaking way (one new/repurposed column), and doesn't require picking a new storage vendor — Backblaze already works, it's just missing a few finishing touches.

---

## 3. Frontend: what makes file management feel "weird" today

Walking through every place the frontend touches files:

- **`components/shared/form/FormFileUpload.tsx`** — the one uploader actually used everywhere (projects, blog, profile, certifications, the Files browser). It's a bare `<input type="file">` styled with Tailwind's `file:` classes. No drag-and-drop, no image preview, no upload progress, no client-side size/type validation (you find out a file is too big or the wrong type only after the server rejects it).
- **`components/shared/form/CustomFileUpload.tsx`** — a second, nicer uploader (drag-to-click area, local image preview) that is **completely unused** — dead code sitting next to the one that's actually wired up everywhere. Confusing to maintain, and the better of the two isn't the one anyone sees.
- **`components/shared/form/FileSelectField.tsx`** — used for single `file_id` relationships (skill logo, service logo, award/certification/education/experience images). It's a searchable dropdown over *already-uploaded* files, filtered to `model_name="others"`. To set a skill's logo, you currently have to:
  1. Go to **Admin → Files**, drill into the "Others" category, click "Add File", upload the image there.
  2. Go to **Admin → Skills**, open "Add Skill", open the searchable file dropdown, find the file you just uploaded by name, and select it.

  That two-screen round trip, with no way to upload directly from the skill form, is very likely the single biggest reason this feels clunky. It's the same story for services, awards, certifications, and education.
- **The admin Files browser (`/admin/files`)** only exposes two categories: "Profile" and "Others" (hardcoded in the page, not derived from what's actually in the database). Files that belong to a specific project, certification, or blog post aren't browsable from here at all — the only way to see "what files are attached to Project X" is to open that project's row in the Projects admin page and use its "View Project Files" action. The Files page's own category picker is effectively only useful for the "others" bucket that `FileSelectField` reads from.
- **No visual grid.** Both the Files browser and `FileSelectField`'s dropdown list files by filename text, not by thumbnail. Finding "which logo is this" means opening files one at a time.
- **No bulk actions.** No multi-select, no bulk delete, no bulk move between categories.
- **No drag-to-reorder**, despite the backend already having `position` and a working `move_file_to_position` method. Reordering project screenshots today means editing a number field on each file individually.
- **No "replace" action anywhere in the UI**, which compounds the backend gap in §2.6 — even once that's fixed backend-side, nothing in the admin calls it yet.
- **"Download" doesn't download.** `FileCard`'s dropdown "Download" action just opens the file's URL in a new tab (`window.open(url, '_blank')`), same as "View" — for most file types the browser will just display it again rather than saving it.
- **Minor:** the file redux slice shares one `isLoading` flag between the file *list* fetch and file *upload/delete* actions (the same pattern I already fixed on the admin Profile page for a different slice). Low priority, but worth folding into whichever pass touches the file components, since it can make an open "Edit File" modal's save button flicker if a background file list refetch happens at the same time.

---

## 4. Proposed frontend redesign

The goal: uploading and attaching a file should never require leaving the form you're already in, and managing files that already exist should be a visual, not a text-list, experience.

### 4.1 One real uploader component

Replace `FormFileUpload` (and delete the unused `CustomFileUpload`) with a single `<FileDropzone>`:
- Drag-and-drop area plus click-to-browse, styled consistently with the rest of the form system (tokens from the design pass earlier this session).
- Immediate local thumbnail preview for images (the one good idea from the dead `CustomFileUpload`, kept).
- Client-side validation before anything hits the network: file type against `accept`, size against a max (surfaced as a prop, matching the backend's `FILE_UPLOAD_LIMIT_MB`), with an inline error instead of a failed request.
- A real upload progress indicator (axios supports `onUploadProgress`; today nothing shows progress for what can be a multi-second upload on a slow connection).
- Support for multiple files with a per-file remove-before-upload control, replacing the current "just list the filenames, no way to drop one" behavior.

### 4.2 Upload-inline-from-any-form (the main fix)

Extend `FileSelectField` so it does two things instead of one:
- **Pick an existing file** (current behavior, kept, since re-using an already-uploaded logo across multiple records is legitimate).
- **Upload a new file right there** — a "Upload new" tab/button inside the same field that opens the new `<FileDropzone>`, uploads immediately on drop, and auto-selects the result as soon as it succeeds. This collapses the current two-screen hop (§3) into one action inside the Skill/Service/Award/Certification/Education form the admin is already filling out.

This is the highest-leverage single change in this plan for how "easy to manage" file attachment feels.

### 4.3 A real Files browser

Rework `/admin/files` from a two-category picker into a proper library:
- Group by the *actual* `model_name` values present in the data (Projects, Blog, Certifications, Others, Profile, ...) rather than a hardcoded two-item list, so every file in the system is reachable from one place.
- Within a group, list by `model_id` when one is set (e.g. "Project: E-commerce Platform" as a sub-group) so you can find "all files for this specific project" without leaving the Files page.
- Thumbnail grid view (image files show a real preview tile; non-image files show a file-type icon tile), with filename/label underneath — replacing the current text-only rows.
- Multi-select with bulk delete.
- Drag-to-reorder within a group, calling the existing `move_file_to_position` backend method (already implemented, currently only reachable one field-edit at a time).

### 4.4 Per-file actions, everywhere a file appears

Standardize `FileCard`'s action menu (and add it anywhere a single attached file is shown, e.g. next to a skill logo in its edit form) to:
- **Replace** — opens the new dropzone, uploads a new file, and updates the existing `File` record's content in place via the backend fix in §2.6, so nothing that references this `file_id` ever needs to be re-linked.
- **View** — unchanged, opens in a new tab.
- **Download** — fixed to force an actual save (`download` attribute on the link, or an `?download=1`-style backend param that sets `Content-Disposition: attachment`), not just "view again."
- **Copy URL** — unchanged, already works.
- **Delete** — unchanged UX-wise (already goes through the confirm dialog from this session's earlier work), but will now actually clean up Backblaze once §2.3 lands.

### 4.5 Image reliability, independent of the backend fix

Regardless of when/whether the backend URL-expiry fix (§2.1) lands, harden the frontend so a broken remote image degrades gracefully instead of looking like a data-loss bug:
- `ImageComponent`'s fallback image should look intentional (a subtle "image unavailable" placeholder with an icon, not a generic broken-image box) — small, but changes the story from "something is broken" to "this file needs re-uploading."
- Surface a "Broken" badge or icon on `FileCard`/thumbnail grid tiles when an image fails to load, so the admin can spot and fix stale files proactively from the Files browser instead of discovering them on the public site.

---

## 5. Suggested order of work

1. **Backend §2.1 (URL expiry fix).** Do this first and separately from everything else — it's a live bug, not a redesign, and every hour it's not fixed is more content quietly going dark on the public site.
2. **Backend §2.3 + §2.5 (delete cleanup + storage key)**, since §4.4's "Replace" action and honest deletes depend on them.
3. **Backend §2.2, §2.4, §2.6** (unify upload path, remove dead endpoints, enable replace) — bundle these together since they touch the same files.
4. **Frontend §4.1 (`FileDropzone`)** — foundational component everything else in the frontend plan builds on.
5. **Frontend §4.2 (inline upload in `FileSelectField`)** — the change you'll feel the most day to day.
6. **Frontend §4.4 (replace/download actions)** — depends on step 3.
7. **Frontend §4.3 (Files browser rework)** — the biggest single frontend piece, reasonable to do last since the other steps make it less urgent (you'll need it less once §4.2 means you rarely have to go there to attach a file).
8. **Frontend §4.5 (broken-image polish)** — cheap, can slot in anywhere, most useful once §2.1 is fixed and any remaining breakage is genuinely rare rather than routine.

---

## 6. Open questions for you before implementation starts

- **Bucket visibility:** OK to make the B2 bucket public-read (§2.1's recommended fix)? If there's a reason it must stay private (e.g. you plan to store non-public files here later), say so and I'll plan the presign-refresh approach instead.
- **Existing broken files:** once §2.1 ships, every file uploaded more than an hour before the fix will still have a dead URL saved in the database (the fix stops new expirations, it doesn't repair old rows). Worth a one-off script to re-upload/re-sign everything currently in the `files` table, or acceptable to just re-upload the handful of assets you actually care about by hand? Use one off script
- **Local `filestorage/` files:** if anything was ever uploaded through the local-disk path (before it's unified onto Backblaze per §2.2), do you know of any files that only exist there, so they can be migrated rather than silently dropped? I don't think there are any files stored in fileatorage
