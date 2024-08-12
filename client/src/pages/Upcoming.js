import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Appear, Table, Paragraph, Words, withStyles } from 'arwes';
import { useParams, useHistory } from 'react-router-dom';
import { httpGetLaunchesUpcoming } from '../hooks/requests'; // Adjust the path if needed
import Clickable from '../components/Clickable'; // Ensure this path is correct
import { Link } from 'react-router-dom'; // Import Link for navigation

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

  const fetchLaunches = useCallback(async () => {
    const fetchedLaunches = await httpGetLaunchesUpcoming(currentPage);
    setLaunches(fetchedLaunches);
  }, [currentPage]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
      history.push(`/upcoming/${newPage}`);
    }
  };

  const tableBody = useMemo(() => {
    return launches
      .filter((launch) => launch.upcoming)
      .map((launch) => (
        <tr key={String(launch.flightNumber)}>
          <td>
            <Clickable style={{ color: 'red' }}>
              <Link
                className={classes.link}
                onClick={() => abortLaunch(launch.flightNumber)}
              >
                ✖
              </Link>
            </Clickable>
          </td>
          <td>{launch.flightNumber}</td>
          <td>{new Date(launch.launchDate).toDateString()}</td>
          <td>{launch.mission}</td>
          <td>{launch.rocket}</td>
          <td>{launch.target}</td>
        </tr>
      ));
  }, [launches, abortLaunch, classes.link]);

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
              <th>Destination</th>
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <span
          style={{ fontSize: '2rem', margin: '0 1rem', cursor: 'pointer' }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
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
