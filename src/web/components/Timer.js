import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const styles = {
  timerWrapper: {
    position: 'relative',
    fontSize: 12,
    paddingRight: '4rem',
  },
  dateTime: {
    position: 'absolute',
    top: -8,
    right: -15,
    fontWeight: 100,
    borderRadius: 5,
    textAlign: 'right',
  },
  counter: {
    fontSize: '1.8em',
    color: '#ee1d67',
    display: 'block',
    lineHeight: '1',
  },
};

class Timer extends React.Component {
    static propTypes = {
      href: PropTypes.string,
      deadline: PropTypes.string,
      initialState: PropTypes.shape(),
    }

    static defaultProps = {
      href: '',
      deadline: '',
      initialState: {
        content: '',
      },
    }

    constructor(props) {
      super(props);
      this.state = props.initialState;

      this.updateTimer = this.updateTimer.bind(this);
    }

    getInitialState = () => ({ content: '' });

    componentDidMount = () => {
      // componentDidMount is called by react when the component
      // has been rendered on the page. We can set the interval here:
      const { deadline } = this.props;

      if (deadline) {
        const eventTime = new Date(deadline).getTime();
        const currentTime = new Date().getTime();

        if (eventTime > currentTime) {
          const interval = 1000;
          const diffTime = eventTime - currentTime;
          let duration = moment.duration(diffTime * 1000, 'milliseconds');

          this.timer = setInterval(() => {
            duration = moment.duration(duration - interval, 'milliseconds');
            this.updateTimer(duration);
          }, interval);
        }
      }
    };

    componentWillUnmount = () => {
      // This method is called immediately before the component is removed
      // from the page and destroyed. We can clear the interval here:

      clearInterval(this.timer);
    };

    updateTimer = (duration) => {
      // This function is called every 50 ms. It updates the
      // missing counter. Calling setState causes the component to be re-rendered
      if (duration && duration.hours) {
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const endTime = `${hours}:${minutes.toString().length == 1 ? '0' + minutes:minutes}:${seconds.toString().length == 1 ? '0' + seconds:seconds}`;
        this.setState({ content: endTime });
      }
    };

    render() {
      const { href } = this.props;
      const { content } = this.state;

      // Although we return an entire <p> element, react will smartly update
      // only the changed parts, which contain the seconds variable.
      return (content &&
        <div style={styles.timerWrapper}>
          <span style={styles.dateTime}>
            <b style={styles.counter}>{content} </b> restantes
          </span>
          <span>
            {(href && <a href={href}>{href}</a>) || null}
          </span>
        </div>
      ) || null;
    }
}

export default Timer;
