import "../styles/projectCard.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React from "react";

interface calanderDateProps {
  date: Date;
}

const CalandarDate = ({ date }: calanderDateProps) => {
  return (
    <div className="date">
      <CalendarTodayIcon></CalendarTodayIcon>
      <div style={{ margin: "10px" }}>
        {date.getDate()}/{date.getMonth()}/{date.getFullYear()}{" "}
      </div>
    </div>
  );
};
export default CalandarDate;
