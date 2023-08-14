import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectTile from "../user_projects/ProjectTile";

const ViewerProjectList = props => {
    const [projectList, setProjectList] = useState([])

    const getProjects = async () => {
        try {
            const response = await fetch("/api/v1/projects/search")
            if(!response.ok) {
                const errorMessage = `${response.status} (${response.statusText})`;
                const error = new Error(errorMessage);
                throw error;
            }
            const responseBody = await response.json();
            setProjectList(responseBody.projects);
        } catch (error) {
            console.error(`Error in Fetch: ${error.message}`);
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const projectsToRender = projectList.map(project => {
        return(
            <Link key={project.id} to={`/projects/${project.id}`}>
                <ProjectTile
                    projectName={project.projectName}
                    regionName={project.regionName}
                    generation={project.generation}
                    creatorName={project.creatorName}
                />
            </Link>
        )
    })

    return(
        <div className="grid-x grid-margin-x">
            <div className="red-bg"/>
            <div className="vl"/>
            <div className="cell auto">
                <h1>Filters</h1>
            </div>
            <div className="cell auto">
                <h1>Browse Projects</h1>
                <div className="">
                    {projectsToRender}

                </div>

            </div>
        </div>
    )
}

export default ViewerProjectList