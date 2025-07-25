import { getProjectById, getProjects } from "../redux/slices/project/project";

export function refetchSingleEntity(dispatch: any, entity_id: string): Record<string, any> {
    return {
        "projects": dispatch(getProjectById({
            id: entity_id,
        }))
    }
}

export function refrechAllEntities(dispatch: any): Record<string, any> {
    return {
        "projects": dispatch(getProjects({}))
    }
}