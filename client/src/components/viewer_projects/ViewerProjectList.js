import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectTile from "../user_projects/ProjectTile";

const ViewerProjectList = (props) => {
    const [projectList, setProjectList] = useState([]);

    const getProjects = async () => {
        try {
            const response = await fetch("/api/v1/projects/search");
            if (!response.ok) {
                const errorMessage = `${response.status} (${response.statusText})`;
                const error = new Error(errorMessage);
                throw error;
            }
            const responseBody = await response.json();
            setProjectList(responseBody.projects);
        } catch (error) {
            console.error(`Error in Fetch: ${error.message}`);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    const projectsToRender = projectList.map((project) => {
        return (
            <div key={project.id} className="container-project-cell cell small-12 medium-6">
                <Link
                    key={project.id}
                    to={`/projects/${project.id}/pokemon`}
                    className="button"
                    style={{ width: "90%" }}
                >
                    <ProjectTile
                        projectName={project.projectName}
                        regionName={project.regionName}
                        generation={project.generation}
                        creatorName={project.creatorName}
                    />
                </Link>
            </div>
        );
    });

    return (
        <div className="poke-grid-project-list">
            <div className="nav-pane-left">
                <h1>Filters</h1>
            </div>
            <div className="overflow-scroll">
                <h1>Browse Projects</h1>
                <div className="grid-x">
                    {projectsToRender}
                </div>
            </div>
        </div>
    );
};

export default ViewerProjectList;
