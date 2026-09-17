import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const catRef = useRef(null);
  const animationRef = useRef(null);
  const clickTimer = useRef(null);
  const attackTimer = useRef(null);

  const position = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const target = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [emotion, setEmotion] = useState("normal");
  const [hover, setHover] = useState(false);
  const [sleeping, setSleeping] = useState(false);

  const [clicks, setClicks] = useState(0);
  const [catSound, setCatSound] = useState("meow~");

  const [attacking, setAttacking] = useState(false);

  /* =====================================================
     MEOW SOUND
  ===================================================== */

  const meow = (type = "normal") => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const ctx = new AudioContext();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = type === "angry" ? "sawtooth" : "sine";

      if (type === "angry") {
        oscillator.frequency.setValueAtTime(
          220,
          ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
          90,
          ctx.currentTime + 0.35
        );

        gain.gain.setValueAtTime(
          0.0001,
          ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.18,
          ctx.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 0.38
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.4);
      } else {
        oscillator.frequency.setValueAtTime(
          500,
          ctx.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
          850,
          ctx.currentTime + 0.12
        );

        oscillator.frequency.exponentialRampToValueAtTime(
          430,
          ctx.currentTime + 0.45
        );

        gain.gain.setValueAtTime(
          0.0001,
          ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.2,
          ctx.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 0.5
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
      }

      oscillator.onended = () => {
        ctx.close();
      };
    } catch {
      // Ignore audio errors.
    }
  };

  /* =====================================================
     CURSOR FOLLOW
  ===================================================== */

  useEffect(() => {
    const handleMouseMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      setSleeping(false);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  /* =====================================================
     CAT MOVEMENT
  ===================================================== */

  useEffect(() => {
    const moveCat = () => {
      if (!attacking) {
        const current = position.current;
        const destination = target.current;

        const dx = destination.x - current.x;
        const dy = destination.y - current.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        /*
          Smooth cat movement
        */
        const speed = 0.045;

        if (distance > 10) {
          current.x += dx * speed;
          current.y += dy * speed;

          setSleeping(false);
        } else {
          setSleeping(true);
        }

        if (catRef.current) {
          const direction =
            destination.x < current.x ? -1 : 1;

          catRef.current.style.transform = `
            translate(
              ${current.x - 200}px,
              ${current.y - 210}px
            )
            scaleX(${direction})
          `;
        }
      }

      animationRef.current =
        requestAnimationFrame(moveCat);
    };

    animationRef.current =
      requestAnimationFrame(moveCat);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [attacking]);

  /* =====================================================
     IDLE CAT SOUNDS
  ===================================================== */

  useEffect(() => {
    if (!sleeping || attacking) {
      setCatSound("meow~");
      return;
    }

    const sounds = [
      "meow~",
      "hmm..",
      "mew~",
      "hmm...",
      "meow",
    ];

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % sounds.length;

      setCatSound(sounds[index]);
    }, 1800);

    return () => {
      clearInterval(interval);
    };
  }, [sleeping, attacking]);

  /* =====================================================
     CAT ATTACK
  ===================================================== */

  const attack = () => {
    if (attacking) return;

    clearTimeout(attackTimer.current);

    setAttacking(true);
    setSleeping(false);
    setEmotion("attack");

    /*
      Angry sound
    */
    meow("angry");

    /*
      Attack lasts around 2.3 seconds
    */
    attackTimer.current = setTimeout(() => {
      setAttacking(false);
      setEmotion("normal");
      setClicks(0);
    }, 2300);
  };

  /* =====================================================
     CLICK
  ===================================================== */

  const handleClick = () => {
    if (attacking) return;

    setSleeping(false);

    setClicks((previous) => {
      const newCount = previous + 1;

      /*
        14th click = ATTACK
      */
      if (newCount > 13) {
        attack();
        return newCount;
      }

      /*
        7 - 13 = increasingly angry
      */
      if (newCount >= 7) {
        setEmotion("angry");
        meow("angry");
      } else {
        setEmotion("happy");
        meow("normal");
      }

      /*
        Reset counter if user stops clicking
      */
      clearTimeout(clickTimer.current);

      clickTimer.current = setTimeout(() => {
        setClicks(0);

        setEmotion((current) => {
          if (current === "happy" || current === "angry") {
            return "normal";
          }

          return current;
        });
      }, 2500);

      return newCount;
    });
  };

  /* =====================================================
     RIGHT CLICK = CRY
  ===================================================== */

  const handleRightClick = (event) => {
    event.preventDefault();

    if (attacking) return;

    setSleeping(false);
    setEmotion("cry");

    setTimeout(() => {
      setEmotion("normal");
    }, 2500);
  };

  /* =====================================================
     HOVER
  ===================================================== */

  const handleMouseEnter = () => {
    if (attacking) return;

    setHover(true);

    if (
      emotion !== "cry" &&
      emotion !== "angry"
    ) {
      setEmotion("happy");
    }
  };

  const handleMouseLeave = () => {
    setHover(false);

    if (emotion === "happy") {
      setEmotion("normal");
    }
  };

  /* =====================================================
     EMOTION STATES
  ===================================================== */

  const isAngry = emotion === "angry";
  const isCrying = emotion === "cry";

  const isHappy =
    hover ||
    emotion === "happy";

  return (
    <main className="page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="background-glow" />

      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      {/* =================================================
          ATTACK SCREEN
      ================================================= */}

      {attacking && (
  <div className="attack-screen">

    {/* ==========================================
        CINEMATIC SCREEN IMPACT
    ========================================== */}

    <div className="attack-flash" />

    <div className="screen-depth" />

    {/* ==========================================
        3D SCREEN TEAR
    ========================================== */}

    <div className="screen-tears">

      {/* CLAW 1 */}

      <div className="tear tear-one">
        <div className="tear-edge left" />
        <div className="tear-edge right" />
        <div className="tear-depth" />
      </div>

      {/* CLAW 2 */}

      <div className="tear tear-two">
        <div className="tear-edge left" />
        <div className="tear-edge right" />
        <div className="tear-depth" />
      </div>

      {/* CLAW 3 */}

      <div className="tear tear-three">
        <div className="tear-edge left" />
        <div className="tear-edge right" />
        <div className="tear-depth" />
      </div>

    </div>

    {/* ==========================================
        BLOOD DROPS
    ========================================== */}

    <div className="blood-drops">

      <span className="blood blood-one" />
      <span className="blood blood-two" />
      <span className="blood blood-three" />
      <span className="blood blood-four" />
      <span className="blood blood-five" />
      <span className="blood blood-six" />

    </div>

    {/* ==========================================
        SPEED PARTICLES
    ========================================== */}

    <div className="attack-particles">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>

    {/* ==========================================
        ATTACK MESSAGE
    ========================================== */}

    <div className="attack-message">
      <span className="attack-kanji">💢</span>
      <span>NYAAA!</span>
    </div>

  </div>
)}

      {/* =================================================
          CAT
      ================================================= */}

      <div
        ref={catRef}
        className={`
          cat-wrapper

          ${sleeping ? "sleeping" : ""}

          ${isAngry ? "angry" : ""}

          ${isCrying ? "crying" : ""}

          ${isHappy ? "happy" : ""}

          ${attacking ? "cat-attacking" : ""}
        `}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        {/* =================================================
            IDLE BUBBLES
        ================================================= */}

        {sleeping && !attacking && (
          <div className="idle-bubbles">

            <span className="idle-dot dot1">
              •
            </span>

            <span className="idle-dot dot2">
              •
            </span>

            <span className="idle-dot dot3">
              •
            </span>

          </div>
        )}

        {/* =================================================
            HEARTS
        ================================================= */}

        {isHappy &&
          !isAngry &&
          !isCrying &&
          !attacking && (
            <div className="heart-effects">

              <span>♥</span>
              <span>♡</span>
              <span>♥</span>

            </div>
          )}

        {/* =================================================
            CRY
        ================================================= */}

        {isCrying && (
          <div className="cry-text">
            ㅠㅠ
          </div>
        )}

        {/* =================================================
            ANGRY SYMBOL
        ================================================= */}

        {isAngry && (
          <div className="angry-symbol">
            💢
          </div>
        )}

        {/* =================================================
            CAT SVG
        ================================================= */}

        <svg
          className="anime-cat"
          viewBox="0 0 400 420"
          xmlns="http://www.w3.org/2000/svg"
        >

          {/* Shadow */}

          <ellipse
            className="cat-shadow"
            cx="200"
            cy="370"
            rx="85"
            ry="14"
          />

          {/* Tail */}

          <path
            className="tail"
            d="
              M280 300
              C350 310 360 245 320 225
              C295 212 280 235 305 250
            "
            fill="none"
            stroke="#f5b7d2"
            strokeWidth="19"
            strokeLinecap="round"
          />

          {/* Body */}

          <ellipse
            cx="200"
            cy="290"
            rx="78"
            ry="86"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
          />

          {/* Belly */}

          <ellipse
            cx="200"
            cy="305"
            rx="48"
            ry="58"
            fill="#ffe0ed"
          />

          {/* Left ear */}

          <path
            className="ear left-ear"
            d="M137 140 L120 62 L180 110 Z"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          <path
            d="M137 101 L132 79 L162 108 Z"
            fill="#f29bc1"
          />

          {/* Right ear */}

          <path
            className="ear right-ear"
            d="M263 140 L280 62 L220 110 Z"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          <path
            d="M263 101 L268 79 L238 108 Z"
            fill="#f29bc1"
          />

          {/* Head */}

          <ellipse
            cx="200"
            cy="165"
            rx="88"
            ry="76"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
          />

          {/* Hair */}

          <path
            d="
              M142 133
              Q158 96 181 119
              Q198 87 210 119
              Q234 94 258 135
            "
            fill="#f2a5c7"
            stroke="#29243a"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* =================================================
              NORMAL / HAPPY EYES
          ================================================= */}

          {!isAngry && !attacking && (
            <g className="eyes">

              <ellipse
                cx="165"
                cy="166"
                rx="13"
                ry="19"
                fill="#29243a"
              />

              <ellipse
                cx="235"
                cy="166"
                rx="13"
                ry="19"
                fill="#29243a"
              />

              <circle
                cx="161"
                cy="159"
                r="4.5"
                fill="white"
              />

              <circle
                cx="231"
                cy="159"
                r="4.5"
                fill="white"
              />

            </g>
          )}

          {/* =================================================
              ANGRY EYES
          ================================================= */}

          {(isAngry || attacking) && (
            <g className="angry-eyes">

              <path
                d="M148 155 L180 168"
                stroke="#29243a"
                strokeWidth="8"
                strokeLinecap="round"
              />

              <path
                d="M252 155 L220 168"
                stroke="#29243a"
                strokeWidth="8"
                strokeLinecap="round"
              />

              <ellipse
                cx="165"
                cy="172"
                rx="9"
                ry="13"
                fill="#29243a"
              />

              <ellipse
                cx="235"
                cy="172"
                rx="9"
                ry="13"
                fill="#29243a"
              />

            </g>
          )}

          {/* Blush */}

          <ellipse
            className="blush left-blush"
            cx="142"
            cy="192"
            rx="19"
            ry="8"
            fill="#f18db8"
          />

          <ellipse
            className="blush right-blush"
            cx="258"
            cy="192"
            rx="19"
            ry="8"
            fill="#f18db8"
          />

          {/* Nose */}

          <path
            d="
              M194 185
              Q200 191 206 185
              Q200 198 194 185
            "
            fill="#df729e"
          />

          {/* Happy mouth */}

          {isHappy &&
            !isAngry &&
            !isCrying && (
              <path
                className="happy-mouth"
                d="
                  M200 198
                  Q190 210 181 201

                  M200 198
                  Q210 210 219 201
                "
                fill="none"
                stroke="#29243a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

          {/* Normal mouth */}

          {!isHappy &&
            !isAngry &&
            !isCrying &&
            !attacking && (
              <path
                d="
                  M200 198
                  Q193 205 187 200

                  M200 198
                  Q207 205 213 200
                "
                fill="none"
                stroke="#29243a"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

          {/* Angry mouth */}

          {(isAngry || attacking) && (
            <path
              d="M187 205 Q200 193 213 205"
              fill="none"
              stroke="#29243a"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Whiskers */}

          <g
            fill="none"
            stroke="#29243a"
            strokeWidth="2.5"
            strokeLinecap="round"
          >

            <path d="M142 181 L95 172" />
            <path d="M142 190 L92 190" />
            <path d="M142 199 L98 210" />

            <path d="M258 181 L305 172" />
            <path d="M258 190 L308 190" />
            <path d="M258 199 L302 210" />

          </g>

          {/* Arms */}

          <path
            className="arm left-arm"
            d="M139 280 Q108 300 139 325"
            fill="none"
            stroke="#29243a"
            strokeWidth="9"
            strokeLinecap="round"
          />

          <path
            className="arm right-arm"
            d="M261 280 Q292 300 261 325"
            fill="none"
            stroke="#29243a"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Feet */}

          <ellipse
            className="foot left-foot"
            cx="163"
            cy="367"
            rx="30"
            ry="13"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
          />

          <ellipse
            className="foot right-foot"
            cx="237"
            cy="367"
            rx="30"
            ry="13"
            fill="#fff5fa"
            stroke="#29243a"
            strokeWidth="5"
          />

          {/* Paw pads */}

          <circle
            cx="156"
            cy="367"
            r="3"
            fill="#ee92b9"
          />

          <circle
            cx="171"
            cy="367"
            r="3"
            fill="#ee92b9"
          />

          <circle
            cx="229"
            cy="367"
            r="3"
            fill="#ee92b9"
          />

          <circle
            cx="244"
            cy="367"
            r="3"
            fill="#ee92b9"
          />

          {/* =================================================
              TEARS
          ================================================= */}

          {isCrying && (
            <g className="tears">

              <path
                d="
                  M165 184
                  C157 198 158 209 165 214
                  C172 209 173 198 165 184
                "
                fill="#67c8ff"
              />

              <path
                d="
                  M235 184
                  C227 198 228 209 235 214
                  C242 209 243 198 235 184
                "
                fill="#67c8ff"
              />

            </g>
          )}

        </svg>

        {/* =================================================
            CAT TEXT
        ================================================= */}

        <div
          className={`
            meow-text

            ${sleeping ? "sleep-meow" : ""}

            ${isAngry ? "angry-meow" : ""}

            ${isCrying ? "cry-meow" : ""}

            ${attacking ? "attack-meow" : ""}
          `}
        >

          {attacking
            ? "NYAAA!"
            : isAngry
            ? "grrr..."
            : isCrying
            ? "meow... 😿"
            : sleeping
            ? catSound
            : "meow~"}

        </div>

      </div>

      {/* =================================================
          CLICK COUNTER
      ================================================= */}

      {clicks > 0 &&
        clicks < 14 &&
        !attacking && (
          <div className="click-counter">
            {clicks >= 7
              ? `Don't touch me... ${clicks}/14`
              : `pet me ${clicks}/14`}
          </div>
        )}

    </main>
  );
}

export default App;