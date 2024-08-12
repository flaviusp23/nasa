import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Appear, Table, Paragraph, Words, withStyles } from 'arwes';
import { useParams, useHistory } from 'react-router-dom';
import { httpGetLaunchesUpcoming } from '../hooks/requests';
import Clickable from '../components/Clickable';
import { Link } from 'react-router-dom';

const styles = () => ({
  link: {
    color: 'red',
    textDecoration: 'none',
  },
});

const Upcoming = (props) => {
  const { entered, abortLaunch, classes } = props;
  const { page = 1 } = useParams(); // Get the page number from URL
  const history = useHistory();

  const [launches, setLaunches] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page));

  const fetchLaunches = useCallback(async (pageToFetch) => {
    const fetchedLaunches = await httpGetLaunchesUpcoming(pageToFetch);
    return fetchedLaunches;
  }, []);

  useEffect(() => {
    const loadLaunches = async () => {
      const fetchedLaunches = await fetchLaunches(currentPage);
      setLaunches(fetchedLaunches);
    };
    loadLaunches();
  }, [fetchLaunches, currentPage]);

  const handlePageChange = async (newPage) => {
    if (newPage > 0) {
      // Fetch launches for the new page to check if it's empty
      const nextPageLaunches = await fetchLaunches(newPage);
      if (nextPageLaunches.length > 0) {
        setCurrentPage(newPage);
        history.push(`/upcoming/${newPage}`);
      }
    }
  };

  const handleAbort = useCallback(
    async (id) => {
      await abortLaunch(id); // Abort the launch
      const updatedLaunches = await fetchLaunches(currentPage); // Refetch launches after abort
      setLaunches(updatedLaunches);
    },
    [abortLaunch, fetchLaunches, currentPage]
  );

  // Memoize table body
  const tableBody = useMemo(() => {
    return launches
      .filter((launch) => launch.upcoming)
      .map((launch) => (
        <tr key={String(launch.flightNumber)}>
          <td style={{ textAlign: "center" }}>
            <Clickable style={{ color: 'red' }}>
              <Link
                className={classes.link}
                onClick={() => handleAbort(launch.flightNumber)}
              >
                ✖
              </Link>
            </Clickable>
          </td>
          <td style={{ textAlign: "center" }}>{launch.flightNumber}</td>
          <td style={{ maxWidth: "10rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={new Date(launch.launchDate).toDateString()}>
            {new Date(launch.launchDate).toDateString()}
          </td>
          <td style={{ maxWidth: "11rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.mission}>
            {launch.mission}
          </td>
          <td style={{ maxWidth: "11rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.rocket}>
            {launch.rocket}
          </td>
          <td style={{ maxWidth: "15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={launch.target}>
            {launch.target}
          </td>
        </tr>
      ));
  }, [launches, handleAbort, classes.link]);

  return (
    <Appear id="upcoming" animate show={entered}>
      <Paragraph>
        Upcoming missions including both SpaceX launches and newly scheduled rockets.
      </Paragraph>
      <Words animate>Warning! Clicking on the ✖ aborts the mission.</Words>
      <Table animate show={entered}>
        <table style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '3rem' }}></th>
              <th style={{ width: '3rem' }}>No.</th>
              <th style={{ width: '10rem' }}>Date</th>
              <th style={{ width: '11rem' }}>Mission</th>
              <th style={{ width: '11rem' }}>Rocket</th>
              <th style={{ width: '15rem' }}>Destination</th>
            </tr>
          </thead>
          <tbody>
            {tableBody.length > 0 ? (
              tableBody
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No upcoming launches available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Table>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
        <span
          style={{ fontSize: '2rem', margin: '0 1rem', cursor: 'pointer' }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
        </span>
        <span
          style={{ fontSize: '2rem', margin: '0 1rem' }}
        >
          {currentPage}
        </span>
        <span
          style={{ fontSize: '2rem', margin: '0 1rem', cursor: 'pointer' }}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          →
        </span>
      </div>
    </Appear>
  );
};

export default withStyles(styles)(Upcoming);
