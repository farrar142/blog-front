import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
export default (props) => {
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(1);
  return (
    <div style={styles.calenderCon}>
      <YearDisp year={year} setYear={setYear} />
      <MonthDisp month={month} setMonth={setMonth} />
      <WeekDisp />
      <DayDisp />
      <div>캘린더 예시.</div>
    </div>
  );
};
const YearDisp = (props) => {
  const year = props.year;
  const setYear = props.setYear;
  const yearHandler = (e) => {
    setYear(e.target.value);
  };
  return <input type="number" value={year} onChange={yearHandler} />;
};
const MonthDisp = (props) => {
  const month = props.month;
  const setMonth = props.setMonth;
  const monthHandler = (number) => {
    setMonth(month + number);
  };
  const MonthDecreaseButton = () => {
    if (month == 1) {
      return <button></button>;
    } else {
      return <button onClick={() => monthHandler(-1)}>{"<<"}</button>;
    }
  };
  const MonthIncreaseButton = () => {
    if (month == 12) {
      return <button></button>;
    } else {
      return <button onClick={() => monthHandler(1)}>{">>"}</button>;
    }
  };
  return (
    <div style={styles.monthCon}>
      <MonthDecreaseButton />
      <div style={styles.monthLetter}>{getMonth(month).shortName(3)}</div>
      <MonthIncreaseButton />
    </div>
  );
};
const WeekDisp = (props) => {
  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div style={styles.weekDisplayCon}>
      {weeks.map((day) => {
        return <div style={styles.item}>{day}</div>;
      })}
    </div>
  );
};
const DayDisp = (props) => {
  const width = [...Array(5).keys()];
  const height = [...Array(7).keys()];
  let daysOffset = 0;
  const days = width.map((i) => {
    return (
      <div style={styles.dayWidthDispCon}>
        {height.map((j) => {
          return <div style={styles.item}>{daysOffset++}</div>;
        })}
      </div>
    );
  });
  return <div style={styles.dayDisplayCon}>{days}</div>;
};

const getMonth = (idx) => {
  const offset = idx - 1;
  const theMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return {
    fullname: theMonths[offset],
    shortName: (length) => {
      return theMonths[offset].slice(0, length);
    },
  };
};

const styles = {
  calenderCon: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.7rem",
  },
  monthCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  weekDisplayCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayWidthDispCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayDisplayCon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    textAlign: "center",
    width: "25px",
    margin: "5px",
  },
  monthLetter: {
    fontSize: "1.2rem",
  },
};
