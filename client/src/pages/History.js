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

  // Fetch launches based on the page number
  const fetchLaunches = useCallback(async (pageToFetch) => {
    const fetchedLaunches = await httpGetLaunchesHistory(pageToFetch);
    return fetchedLaunches;
  }, []);

  // Load launches when the component mounts or page changes
  useEffect(() => {
    const loadLaunches = async () => {
      const fetchedLaunches = await fetchLaunches(currentPage);
      setLaunches(fetchedLaunches);
    };
    loadLaunches();
  }, [fetchLaunches, currentPage]);

  // Handle page changes with data check
  const handlePageChange = async (newPage) => {
    if (newPage > 0) {
      // Fetch launches for the new page to check if it's empty
      const nextPageLaunches = await fetchLaunches(newPage);
      if (nextPageLaunches.length > 0) {
        setCurrentPage(newPage);
        history.push(`/history/${newPage}`);
      }
    }
  };

  // Memoize table body
  const tableBody = useMemo(() => {
    return launches.map((launch) => (
      <tr key={String(launch.flightNumber)}>
        <td style={{ textAlign: "center" }}>
          <span style={{ color: launch.success ? "greenyellow" : "red" }}>█</span>
        </td>
        <td style={{ textAlign: "center" }}>{launch.flightNumber}</td>
        <td style={{ maxWidth: "9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={new Date(launch.launchDate).toDateString()}>
          {new Date(launch.launchDate).toDateString()}
        </td>
        <td style={{ maxWidth: "15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.mission}>
          {launch.mission}
        </td>
        <td style={{ maxWidth: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.rocket}>
          {launch.rocket}
        </td>
        <td style={{ maxWidth: "15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.customers?.join(", ")}>
          {launch.customers?.join(", ")}
        </td>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1rem" }}>
          <span
            style={{ fontSize: "2rem", margin: "0 1rem", cursor: "pointer" }}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </span>
          <span style={{ fontSize: "2rem", margin: "0 1rem" }}>
            {currentPage}
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
