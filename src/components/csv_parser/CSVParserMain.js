import React, { useState } from "react";
import GroupList from "./GroupList";
import GroupDetail from "./GroupDetail";
import NavBar from "../navbarnew";
import "../../styles/CSVParser/CSVParser.css";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import path from "../path";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../styles/Roomnew.css";
// import { fetcher } from "../services/ApiService";
// import NavBar from "./navbarnew";
// import { useCookies } from "react-cookie";
// import { Card } from "react-bootstrap";
// import default_pic from "../assets/default.png";

export const CSVParserMain = (props) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const [groups, setGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        parseCsv(text);
      };

      reader.readAsText(file);
    }
  };

  const parseCsv = (text) => {
    const rows = text.split("\n").filter((row) => row.trim() !== "");
    const headerRow = rows[0].split(",").map((cell) => cell.trim());
    const dataRows = rows
      .slice(1)
      .map((row) => row.split(",").map((cell) => cell.trim()));

    const groupColumnIndex = 0;

    const sortedRows = dataRows.sort((a, b) =>
      a[groupColumnIndex].localeCompare(b[groupColumnIndex])
    );

    const grouped = sortedRows.reduce((acc, row) => {
      const groupKey = row[groupColumnIndex];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(row);
      return acc;
    }, {});

    setHeaders(headerRow);
    setData(sortedRows);
    setGroups(grouped);
    console.log(grouped);
  };

  const handleGroupClick = (groupName) => {
    setCurrentGroup(groupName);
  };

  const handleBackToList = () => {
    setCurrentGroup(null);
  };

  return (
    <div>
      <div>
        <NavBar role={props.role}></NavBar>
      </div>
      <div className="wrapper">
        <div className="contentWrapper">
          {headers.length !== 0 ? (
            <> <h2>Rooms</h2> </>
          ) : (
            <label for="images" className="drop-container" id="dropcontainer">
              <span className="drop-title">Drop file here</span>
              <input type="file" accept=".csv" onChange={handleFileChange} />
            </label>
          )}

          <div className="mainWrapper">
            {currentGroup ? (
              <GroupDetail
                headers={headers}
                rows={groups[currentGroup]}
                groupName={currentGroup}
                onBack={handleBackToList}
              />
            ) : (
              <GroupList groups={groups} onGroupClick={handleGroupClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
