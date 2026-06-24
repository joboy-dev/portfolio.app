import { getProjectById, getProjects } from "../redux/slices/project/project";
import { getBlogById, getBlogs } from "../redux/slices/blog/blog";

export function refetchSingleEntity(dispatch: any, entity_id: string): Record<string, any> {
    return {
        "projects": dispatch(getProjectById({
            id: entity_id,
        })),
        "blogs": dispatch(getBlogById({
            id: entity_id,
        }))
    }
}

export function refrechAllEntities(dispatch: any): Record<string, any> {
    return {
        "projects": dispatch(getProjects({})),
        "blogs": dispatch(getBlogs({}))
    }
}