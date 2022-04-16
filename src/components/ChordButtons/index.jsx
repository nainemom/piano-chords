import { useEffect, useRef } from 'react'
import './index.css'
import chords from '@/assets/chords.json';
import useAutoResetableState from '@/utils/useAutoResetableState';
import map from '@/utils/map';


export default ({
  onPlay = () => {},
  listenGlobalKeys = true,
}) => {
  const [playingChord, setPlayingChord] = useAutoResetableState(-1, 1);

  const playChord = (chordIndex) => {
    onPlay({
      name: chords[chordIndex][0],
      notes: chords[chordIndex][1],
    });
    setPlayingChord(chordIndex);
  };

  const sideKeyToSectionIndexMap = map([
    ['', 0],
    ['shift', 1],
    ['ctrl', 2],
    ['alt', 3],
    ['shift ctrl', 4],
    ['shift alt', 5],
    ['ctrl alt', 6],
  ]);

  const keyCodeToNoteIndexMap = map([
    [49, 0],
    [50, 1],
    [51, 2],
    [52, 3],
    [53, 4],
    [54, 5],
    [55, 6],
    [56, 7],
    [57, 8],
    [48, 9],
    [189, 10],
    [187, 11],
  ]);

  const keyCodeToKeyNameMap = map([
    [49, '1'],
    [81, 'q'],
    [50, '2'],
    [87, 'w'],
    [51, '3'],
    [69, 'e'],
    [52, '4'],
    [82, 'r'],
    [53, '5'],
    [84, 't'],
    [54, '6'],
    [89, 'y'],
    [55, '7'],
    [85, 'u'],
    [56, '8'],
    [73, 'i'],
    [57, '9'],
    [79, 'o'],
    [48, '0'],
    [80, 'p'],
    [189, '-'],
    [219, '['],
    [187, '+'], 
    [221, ']'], 
  ]);

  const Shortcuts = ({ chordIndex }) => {
    const sectionIndex = Math.floor(chordIndex / 12);
    const noteIndex = chordIndex - (sectionIndex * 12);

    const sideKeys = sideKeyToSectionIndexMap.get(sectionIndex, true).split(' ');
    const keyCode = keyCodeToNoteIndexMap.get(noteIndex, true);
    const keyName = keyCodeToKeyNameMap.get(keyCode);
    

    const shortcuts = [...sideKeys.filter(y => !!y), keyName];

    const Keys = ({ keys }) => (
      <div>
        <span className="ChordButtonShortcut__keys">
          {keys.map((key) => (
            <span className="ChordButtonShortcut__key" key={key}>{key}</span>
          ))}
        </span>
      </div>
    );

    return (
      <div className="ChordButtonShortcut">
        <Keys keys={shortcuts} />
      </div>
    );
  }

  const handleKeyDown = (event) => {
    const { keyCode, shiftKey, ctrlKey, altKey } = event;
    if (!keyCodeToNoteIndexMap.has(keyCode)) return;
    event.preventDefault();

    const sideKey = [shiftKey ? 'shift' : false, ctrlKey ? 'ctrl' : false, altKey ? 'alt' : false].filter(x => !!x).join(' ');
    
    const sectionIndex = sideKeyToSectionIndexMap.get(sideKey);
    
    const noteIndex = keyCodeToNoteIndexMap.get(keyCode);
    
    const chordIndex = (sectionIndex * 12) + noteIndex;
  
    playChord(chordIndex);
  };

  const handleClick = (event, chordIndex) => {
    event.preventDefault();
    playChord(chordIndex);
  };

  const removeKeyDownListener = () => {
    window.removeEventListener('keydown', handleKeyDown, true);
  };
  const addKeyDownListener = () => {
    window.addEventListener('keydown', handleKeyDown, true);
  }

  useEffect(() => () => {
    removeKeyDownListener();
  }, []);

  useEffect(() => {
    if (listenGlobalKeys) {
      addKeyDownListener();
    } else {
      removeKeyDownListener();
    }
  }, [listenGlobalKeys]);

  const buttonsRef = useRef(null);
  useEffect(() => {
    try {
      if (playingChord !== -1) {
        const el = buttonsRef.current.querySelector(`[data-index="${playingChord}"]`);
        if (el) {
          requestAnimationFrame(() => {
            el.removeAttribute('data-playing');
            setTimeout(() => {
              el.setAttribute('data-playing', 'true');
            }, 10);
          });
        }
      }
    } catch (_e) {}
  }, [playingChord]);

  return (
    <div className="ChordButtons" ref={buttonsRef}>
      { chords.map(([name], i) => (
        <button className="ChordButton" data-index={i} key={i} onPointerDown={(event) => handleClick(event, i)}>
          <div className="ChordButton__name">{name}</div>
          <div className="ChordButton__shortcut"> <Shortcuts chordIndex={i} /> </div>
        </button>
      ))}
    </div>
  )
};
