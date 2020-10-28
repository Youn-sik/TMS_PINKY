import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { Grid, Button, TextField, Typography, Card } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { TweenLite, Circ } from 'gsap';
import './SignIn.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {base_url} from 'server.json';
const schema = {
  id: {
    length: {
      maximum: 64
    }
  },
  password: {
    length: {
      maximum: 128
    }
  }
};

const vh = window.innerHeight;
document.documentElement.style.setProperty('--vh', `${vh}px`);

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage:
      "linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ),url('/images/background-space.jpg')",
    animationDuration: '120s',
    animationName: 'slide-bg',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '0 50%',
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 50%'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    marginBottom: theme.spacing(2, 0)
  }
}));

const SignIn = props => {
  const { history, getAuth } = props;

  const classes = useStyles();

  const [value, setValue] = useState(0);

  const [verify, setVerify] = useState(false);

  const canvas = useRef();

  const handleSliderChange = (newValue, event) => {
    if (event.type === 'mousemove') {
      setValue(newValue);
    }
  };

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    (function() {
      var width,
        height,
        ctx,
        points,
        target,
        animateHeader = true;

      // Main
      initHeader();
      initAnimation();
      addListeners();

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        canvas.current.width = width;
        canvas.current.height = height;
        ctx = canvas.current.getContext('2d');

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
          for (var y = 0; y < height; y = y + height / 20) {
            var px = x + (Math.random() * width) / 20;
            var py = y + (Math.random() * height) / 20;
            var p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
            var p2 = points[j];
            if (!(p1 == p2)) {
              var placed = false;
              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
          var c = new Circle(
            points[i],
            2 + Math.random() * 2,
            'rgba(255,255,255,0.3)'
          );
          points[i].circle = c;
        }
      }

      // Event handling
      function addListeners() {
        if (!('ontouchstart' in window)) {
          window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
      }

      function mouseMove(e) {
        var posx = 0;
        var posy = 0;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx =
            e.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
          posy =
            e.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // canvas.current.width = width;
        // canvas.current.height = height;
      }

      // animation
      function initAnimation() {
        animate();
        for (var i in points) {
          shiftPoint(points[i]);
        }
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in points) {
            // detect points in range
            if (Math.abs(getDistance(target, points[i])) < 4000) {
              points[i].active = 0.3;
              points[i].circle.active = 0.6;
            } else if (Math.abs(getDistance(target, points[i])) < 20000) {
              points[i].active = 0.1;
              points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < 40000) {
              points[i].active = 0.02;
              points[i].circle.active = 0.1;
            } else {
              points[i].active = 0;
              points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: Circ.easeInOut,
          onComplete: function() {
            shiftPoint(p);
          }
        });
      }

      // Canvas manipulation
      function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function() {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function() {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(
            _this.pos.x,
            _this.pos.y,
            _this.radius,
            0,
            2 * Math.PI,
            false
          );
          ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
          ctx.fill();
        };
      }

      // Util
      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }
    })();
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = async event => {
    event.preventDefault();
    if (formState.values.id === undefined) {
      alert('아이디를 입력해주세요.');
      return false;
    } else if (formState.values.password === undefined) {
      alert('패스워드를 입력해주세요.');
      return false;
    } else if (verify === false) {
      alert('밀어서 확인을 해주세요.');
      return false;
    } else {
      document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
      let result = await axios
        .post(base_url + '/login', {
          user_id: formState.values.id,
          user_pw: formState.values.password
        })
        .catch(err => {
          alert('존재하지 않는 계정입니다.');
          return false;
        });
      // props.getAuth(result.data.authority);
      if (result.data && result.data.token) {
        document.cookie = 'token=' + result.data.token;
        props.getAuth(result.data.authority);
        history.push('/');
      } else if (result.data) {
        alert('존재하지 않는 계정 입니다');
      }
    }
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    // <div style={{transition: 'opacity .75s',opacity: 1}}>
    <div className={classes.root} id="large-header">
      <canvas
        ref={canvas}
        id="demo-canvas"
        style={{ position: 'absolute', zIndex: '0' }}></canvas>
      <Grid className={classes.grid} alignItems="center" container>
        <Grid className={classes.quoteContainer} item lg={8}>
          {/* <div className={classes.quote}> */}
          {/* <div className={classes.quoteInner}> */}
          {/* <div className={classes.person}>
              </div> */}
          <div
            style={{
              position: 'relative',
              zIndex: '1',
              fontSize: '6em',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
            <span style={{ color: 'white' }}>K</span>oolsign&nbsp;
          </div>
          {/* </div> */}
          {/* </div> */}
        </Grid>
        <Grid
          style={{ position: 'relative', zIndex: '2' }}
          className={classes.content}
          item
          lg={4}
          xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <Card
                style={{
                  backgroundColor: 'rgba(255,255,255,.8)',
                  width: '350px',
                  height: '300px'
                }}>
                <form className={classes.form} onSubmit={handleSignIn}>
                  <Typography className={classes.title} variant="h2">
                    로그인
                  </Typography>
                  <TextField
                    className={classes.textField}
                    error={hasError('id')}
                    fullWidth
                    helperText={hasError('id') ? formState.errors.id[0] : null}
                    label="ID"
                    name="id"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.id || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="비밀번호"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="outlined"
                  />
                  {/* <IonRangeSlider 
                skin={"square"} 
                extra_classes={"captcha"} 
                min={0} 
                max={1000} 
                keyboard={false} 
                hide_min_max={true} 
                hide_from_to={true} 
                onFinish={(v) => {
                  console.log(v);
                }}/> */}
                  {/* <Slider value={value} onChange={handleSliderChange} aria-labelledby="continuous-slider" /> */}
                  <div className="slider orientation-reversed">
                    <div className="slider-group">
                      <div className="slider-horizontal">
                        {verify ? (
                          <div
                            style={{
                              textAlign: 'center',
                              height: 30,
                              margin: '10px 0',
                              lineHeight: '35px'
                            }}>
                            <CheckCircle
                              style={{
                                position: 'relative',
                                top: 3,
                                height: 16,
                                color: '#82b54b'
                              }}
                            />
                            확인.
                          </div>
                        ) : (
                          <Slider
                            min={0}
                            max={50}
                            tooltip={false}
                            value={value}
                            orientation="horizontal"
                            onChange={handleSliderChange}
                            onChangeComplete={() => {
                              if (value < 50) {
                                setValue(0);
                              } else {
                                setVerify(true);
                              }
                            }}
                            handleLabel={'>>>'}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className={classes.signInButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained">
                    로그인
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
    // </div>
  );
};

export default withRouter(SignIn);
