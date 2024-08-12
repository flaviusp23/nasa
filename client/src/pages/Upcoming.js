import React, { useEffect, useState } from 'react';
import { withStyles, Appear, Link, Paragraph, Table, Words } from 'arwes';
import Clickable from '../components/Clickable';
import { useParams } from 'react-router-dom';
import { httpGetLaunchesUpcoming } from '../hooks/requests';

const styles = () => ({
  link: {
    color: 'red',
    textDecoration: 'none',
  },
});

const Upcoming = (props) => {
  const { entered, abortLaunch, classes } = props;
  const { page = 1 } = useParams(); // Get the page number from URL
  const [launches, setLaunches] = useState([]);

  useEffect(() => {
    const fetchLaunches = async () => {
      const upcomingLaunches = await httpGetLaunchesUpcoming(Number(page));
      setLaunches(upcomingLaunches);
    };

    fetchLaunches();
  }, [page]);

  // Create table rows based on launches
  const tableBody = launches
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
    </Appear>
  );
};

export default withStyles(styles)(Upcoming);
