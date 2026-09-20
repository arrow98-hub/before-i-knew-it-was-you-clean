import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";
import { Atmosphere, Thread } from "../components/Atmosphere";
import { Progress } from "../components/Progress";
import { story } from "../content/story";
import { useStoryMotion } from "../lib/useStoryMotion";
import { ScrollStory } from "../components/ScrollStory";

function Chapter({
  number,
  title,
  children,
  mood,
  id,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  mood: string;
  id: string;
}) {
  return (
    <section id={id} className={`chapter ${mood}`}>
      <div className="chapter-label">
        <span>{number}</span>
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
}
function SceneTransition({ tone }: { tone: string }) {
  return (
    <div className={`scene-transition ${tone}`} aria-hidden="true">
      <i className="scene-transition__veil" />
    </div>
  );
}

const STORY_SONG = "/music/Risk%20It%20All.mp3";
const STORY_START = new Date(2026, 7, 18, 21, 0, 0).getTime();

function getElapsedTime() {
  const now = new Date();
  const start = new Date(STORY_START);
  let cursor = new Date(start);
  let years = 0;
  let months = 0;

  while (true) {
    const next = new Date(cursor);
    next.setFullYear(next.getFullYear() + 1);
    if (next > now) break;
    cursor = next;
    years += 1;
  }

  while (true) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + 1);
    if (next > now) break;
    cursor = next;
    months += 1;
  }

  const elapsed = Math.max(0, now.getTime() - cursor.getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  return {
    years,
    months,
    weeks: Math.floor(elapsed / week),
    days: Math.floor((elapsed % week) / day),
    hours: Math.floor((elapsed % day) / hour),
    minutes: Math.floor((elapsed % hour) / minute),
  };
}

export function Story() {
  const root = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(getElapsedTime);
  useEffect(() => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = previousBehavior;
    };
  }, []);
  useEffect(() => {
    const updateElapsedTime = () => setElapsedTime(getElapsedTime());
    const timer = window.setInterval(updateElapsedTime, 1000);
    return () => window.clearInterval(timer);
  }, []);
  useStoryMotion(root);

  const toggleMusic = async () => {
    if (!audio.current || !audioAvailable) return;

    if (audio.current.paused) {
      try {
        await audio.current.play();
        setIsPlaying(true);
      } catch {
        setAudioAvailable(false);
      }
      return;
    }

    audio.current.pause();
    setIsPlaying(false);
  };

  return (
    <main ref={root}>
      <audio
        ref={audio}
        src={STORY_SONG}
        loop
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onError={() => setAudioAvailable(false)}
      />
      <Progress />
      <section className="hero" aria-labelledby="title">
        <img
          className="hero-image"
          src="/images/hero-mountain.jpg"
          alt="Figura solitaria ante una montaña iluminada por la luna"
        />
        <div className="hero-sky" />
        <div className="hero-copy">
          <p className="eyebrow">Una historia en seis capítulos</p>
          <h1 id="title">
            Before I knew
            <br />
            <em>it was you</em>
          </h1>
          <p className="hero-spanish">Antes de saber que eras tú</p>
        </div>
        <div className="scroll-cue">
          <span className="scroll-arrow" aria-hidden="true">
            ↓
          </span>
          <span>desliza para recordar</span>
          <span className="scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
      </section>
      <Chapter id="prologue" number="00" title="Prólogo" mood="prologue">
        <p className="kicker">Antes de saber que eras tú</p>
        <button
          className={`music-toggle${isPlaying ? " is-playing" : ""}`}
          type="button"
          onClick={toggleMusic}
          disabled={!audioAvailable}
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <Music2 size={18} />
          <span>{isPlaying ? "Pausar música" : "Escuchar esta historia"}</span>
          <span className="music-visualizer" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <ScrollStory
          className="prologue-story"
          lines={story.prologue}
          endPadding={8}
        />
        <p className="te-vi">te vi.</p>
        <img
          className="story-image"
          src="/images/eyes.png"
          alt="Una mirada en primer plano"
        />
      </Chapter>
      <Chapter id="looks" number="I" title="Las miradas" mood="looks">
        <div className="aurora" />
        <ScrollStory
          className="looks-story"
          lines={story.looks}
          startOffset={2}
          endPadding={8}
        />
      </Chapter>
      <Chapter id="almost" number="II" title="El casi" mood="almost">
        <div className="liquid" />
        <ScrollStory lines={story.almost} />
        <p className="date">2 de junio.</p>
        <div className="story-image june-image">
          <img
            className="june-image__white"
            src="/images/june_month.png"
            alt="Junio"
          />
          <img
            className="june-image__heart"
            src="/images/june_month.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </Chapter>
      <Chapter
        id="return"
        number="III"
        title="El día que volvimos a encontrarnos"
        mood="return"
      >
        <div className="floating-hearts" aria-hidden="true">
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
          <span>♥</span>
        </div>
        <ScrollStory lines={story.return} />
        <p className="date return-date">18 de agosto.</p>
        <img
          className="story-image"
          src="/images/hands.png"
          alt="Dos manos entrelazadas"
        />
      </Chapter>
      <section className="interlude" aria-label="El hilo rojo">
        <div className="thread-heart" aria-hidden="true">
          ♥
        </div>
        <div className="thread-heart thread-heart-end" aria-hidden="true">
          ♥
        </div>
        <div className="thread-stars" aria-hidden="true">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>
        </div>
        <Thread />
        <div className="interlude-copy">
          <p>Nos conocimos.</p>
          <p>Nos perdimos.</p>
          <p>Seguimos nuestras vidas.</p>
          <p>Pasó el tiempo.</p>
          <p>Volvimos a hablar.</p>
          <p>Volvimos a sonreír.</p>
          <p>Volvimos a elegirnos.</p>
          <h2>
            Quizás nunca estuvimos
            <br />
            realmente separados.
          </h2>
          <p className="long">
            Quizás simplemente estábamos siguiendo caminos que todavía tenían
            que volver a encontrarse.
          </p>
          <p className="arrival">Y entonces llegamos aquí.</p>
        </div>
      </section>
      <Chapter id="august" number="IV" title="18 de agosto" mood="august">
        <Atmosphere variant="stars" />
        <ScrollStory lines={story.august} />
        <div className="question">
          <span>Lo que deseaba profundamente</span>
          <h2>
            ¿Quieres ser
            <br />
            mi novia?
          </h2>
          <p>Y dijiste que sí.</p>
        </div>
        <p className="date">18 de agosto.</p>
        <img
          className="story-image"
          src="/images/august_month.png"
          alt="Recuerdo del mes de agosto"
        />
        <p className="caption">La noche en la que elegimos caminar juntos.</p>
      </Chapter>
      <Chapter id="us" number="V" title="Nosotros" mood="us">
        <div className="rose" />
        <ScrollStory
          className="us-story"
          lines={story.us}
          endPadding={2}
        />
        <img
          className="story-image couple-image"
          src="/images/arian_oriana.png"
          alt="Arian y Oriana juntos"
        />
      </Chapter>
      <Chapter
        id="future"
        number="VI"
        title="Esta historia apenas comienza"
        mood="future"
      >
        <Atmosphere variant="stars" />
        <ScrollStory
          className="future-story"
          lines={story.future}
          endPadding={2}
        />
        <img
          className="story-image couple-small-image"
          src="/images/couple.png"
          alt="Arian y Oriana juntos"
        />
      </Chapter>
      <section className="surprise">
        <Atmosphere variant="stars" />
        <div>
          {story.surprise.opening.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <h2>
            {story.surprise.title[0]}
            <br />
            {story.surprise.title[1]}
          </h2>
          <img
            className="story-image universe-image"
            src="/images/universe.png"
            alt="El cielo estrellado de aquella noche"
          />
          <div className="gift">
            {story.surprise.gift.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>
      <SceneTransition tone="to-end" />
      <footer>
        <Atmosphere variant="particles" />
        <div>
          <p className="date">18 de agosto.</p>
          <h2>El comienzo de todo lo que todavía nos queda por vivir.</h2>
          <p className="signature">Antes de saber que eras tú.</p>
          <div className="elapsed-counter" aria-label="Tiempo transcurrido">
            {elapsedTime.years > 0 && (
              <span>
                {elapsedTime.years}{" "}
                {elapsedTime.years === 1 ? "año" : "años"}
              </span>
            )}
            <span>
              {elapsedTime.months}{" "}
              {elapsedTime.months === 1 ? "mes" : "meses"}
            </span>
            <span>
              {elapsedTime.weeks}{" "}
              {elapsedTime.weeks === 1 ? "semana" : "semanas"}
            </span>
            <span>
              {elapsedTime.days} {elapsedTime.days === 1 ? "día" : "días"}
            </span>
            <span>
              {elapsedTime.hours}{" "}
              {elapsedTime.hours === 1 ? "hora" : "horas"}
            </span>
            <span>
              {elapsedTime.minutes}{" "}
              {elapsedTime.minutes === 1 ? "minuto" : "minutos"}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
