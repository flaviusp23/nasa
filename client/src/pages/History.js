import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Appear, Table, Paragraph } from 'arwes';
import { useParams, useHistory } from 'react-router-dom';
import { httpGetLaunchesHistory } from '../hooks/requests'; // Adjust the path if needed

const History = (props) => {
  const { entered } = props;
  const { page = 1 } = useParams(); // Get the page number from the URL
  const history = useHistory();

  const [launches, setLaunches] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page));

  const fetchLaunches = useCallback(async () => {
    const fetchedLaunches = await httpGetLaunchesHistory(currentPage);
    setLaunches(fetchedLaunches);
  }, [currentPage]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    history.push(`/history/${newPage}`);
  };

  const tableBody = useMemo(() => {
    return launches.map((launch) => (
      <tr key={String(launch.flightNumber)}>
        <td>
          <span style={{ color: launch.success ? "greenyellow" : "red" }}>█</span>
        </td>
        <td>{launch.flightNumber}</td>
        <td>{new Date(launch.launchDate).toDateString()}</td>
        <td>{launch.mission}</td>
        <td>{launch.rocket}</td>
        <td>{launch.customers?.join(", ")}</td>
      </tr>
    ));
  }, [launches]);

  return (
    <article id="history">
      <Appear animate show={entered}>
        <Paragraph>
          History of mission launches including SpaceX launches starting from the year 2006.
        </Paragraph>
        <Table animate>
          <table style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ width: "2rem" }}></th>
                <th style={{ width: "3rem" }}>No.</th>
                <th style={{ width: "9rem" }}>Date</th>
                <th>Mission</th>
                <th style={{ width: "7rem" }}>Rocket</th>
                <th>Customers</th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
        </Table>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <span
            style={{ fontSize: "2rem", margin: "0 1rem", cursor: "pointer" }}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </span>
          <span
            style={{ fontSize: "2rem", margin: "0 1rem", cursor: "pointer" }}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            →
          </span>
        </div>
      </Appear>
    </article>
  );
};

export default History;
