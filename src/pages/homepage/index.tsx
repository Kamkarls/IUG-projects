import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "../../styles/homepage.css";
import { getProjects } from "../../services/getProjects";
import { Project } from "../../models/project";
import { studyFields, locations } from "../../models/allowedValues";
import FilterDropdown from "../../components/FilterDropdown";
import { DocumentData } from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "../../components/Navbar/Layout";
import CircularProgress from "@mui/material/CircularProgress";

function Home() {
  const imagePath = "./../../images/Trax_Ghana.png";
  const [projects, setProjects] = useState<Project[]>([]);
  const [orderBy, setOrderBy] = useState<string>("deadline");
  const [filterLocation, setFilterLocation] = useState<string>("location");
  const [filterStudyField, setFilterStudyField] =
    useState<string>("study_field");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [noProject, setNoProject] = useState(false);
  const limit = 6;

  async function fetchMoreData() {
    setLoading(true);
    const newProjects = await getProjects(
      orderBy,
      filterLocation,
      filterStudyField,
      setLastVisible,
      lastVisible,
      limit
    );
    if (newProjects.length === 0) {
      setHasMore(false);
      setLoading(false);
    } else {
      setProjects([...projects, ...newProjects]);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      const projects = await getProjects(
        orderBy,
        filterLocation,
        filterStudyField,
        setLastVisible,
        null,
        limit
      );
      if (projects.length === 0) {
        setHasMore(false);
        setLoading(false);
        setNoProject(true);
      }
      setProjects(projects);
    }
    fetchData();
  }, [filterLocation, filterStudyField, orderBy]);

  return (
    <div className="homeBackground">
      <Layout>
        <div className="homeOutline">
          <div className="homeTitle"> Projects </div>
          <FilterDropdown value={orderBy} setValue={setOrderBy} sortBy={true} />
          <FilterDropdown
            value={filterLocation}
            setValue={setFilterLocation}
            location={true}
          />
          <FilterDropdown
            value={filterStudyField}
            setValue={setFilterStudyField}
            studyField={true}
          />
          <InfiniteScroll
            dataLength={projects.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div style={{ textAlign: "center" }}>
                <h4>
                  <CircularProgress />
                </h4>
              </div>
            }
            scrollableTarget="scrollableDiv"
            endMessage={<h4></h4>}
          >
            <div className="rowHome">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.shortTitle ?? project.title}
                  description={
                    project.summaryDescription ?? project.description
                  }
                  date={project.deadline.toDate()}
                  topics={[
                    studyFields[project.studyField as keyof typeof studyFields],
                    locations[project.location as keyof typeof locations],
                  ]}
                  imagePath={imagePath}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </Layout>
    </div>
  );
}

export default Home;
