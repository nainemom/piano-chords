import { useEffect, useRef } from 'react'
import './index.css'
import chords from '@/assets/chords';
import useAutoResetableState from '@/utils/useAutoResetableState';

export default ({
  onPlay = () => {},
  listenGlobalKeys = true,
}) => {
  const [playingChord, setPlayingChord] = useAutoResetableState(-1, 1);

  const playChord = (chordIndex, octaveIndex) => {
    onPlay({
      name: chords[chordIndex][0],
      notes: chords[chordIndex][1][octaveIndex],
    });
    setPlayingChord(chordIndex);
  };

  const sideKeyToSectionIndexMap = [
    ['', 0],
    ['shift', 1],
    ['ctrl', 2],
    ['alt', 3],
    ['shift ctrl', 4],
    ['shift alt', 5],
    ['ctrl alt', 6],
  ];

  const keyCodeToNoteIndexMap = [
    [[49, 81], 0],
    [[50, 87], 1],
    [[51, 69], 2],
    [[52, 82], 3],
    [[53, 84], 4],
    [[54, 89], 5],
    [[55, 85], 6],
    [[56, 73], 7],
    [[57, 79], 8],
    [[48, 80], 9],
    [[189, 219], 10],
    [[187, 221], 11],
  ];

  const keyCodeToKeyNameMap = [
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
  ];

  const Shortcuts = ({ chordIndex }) => {
    const sectionIndex = Math.floor(chordIndex / 12);
    const noteIndex = chordIndex - (sectionIndex * 12);

    const sideKeys = sideKeyToSectionIndexMap.find(([, val]) => val === sectionIndex)[0].split(' ');
    const keyCodes = keyCodeToNoteIndexMap.find(([,val]) => val === noteIndex)[0];
    const keyNames = keyCodeToKeyNameMap.filter(([val]) => keyCodes.includes(val)).map((x) => x[1]);

    const shortcuts = keyNames.map((x) => [...sideKeys.filter(y => !!y), x]);

    const Keys = ({ keys }) => (
      <div>
        <span className="ChordButtonShortcut__keys"> {keys.map((key) => (
          <span className="ChordButtonShortcut__key" key={key}>{key}</span>
        ))} </span>
      </div>
    );

    return (
      <div className="ChordButtonShortcut">
        {
          shortcuts.map((keys) => (
            <Keys key={keys} keys={keys} />
          ))
        }
      </div>
    );
  }

  const handleKeyDown = (event) => {
    const { keyCode, shiftKey, ctrlKey, altKey } = event;
    if (!keyCodeToNoteIndexMap.find(([val]) => val.includes(keyCode))) return;
    event.preventDefault();

    const sideKey = [shiftKey ? 'shift' : false, ctrlKey ? 'ctrl' : false, altKey ? 'alt' : false].filter(x => !!x).join(' ');

    const sectionIndex = sideKeyToSectionIndexMap.find(([val]) => val === sideKey)[1];
    
    const noteIndexMapped = keyCodeToNoteIndexMap.find(([val]) => val.includes(keyCode));

    const noteIndex = noteIndexMapped[1];

    const octaveIndex = noteIndexMapped[0].indexOf(keyCode);

    const chordIndex = (sectionIndex * 12) + noteIndex;
    
    playChord(chordIndex, octaveIndex);

  };

  const handleClick = (event, chordIndex) => {
    event.preventDefault();
    let chordOctave = 0;
    if (event.button !== 0) {
      chordOctave = 1;
    }
    playChord(chordIndex, chordOctave);
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
      if (playingChord) {
        const el = buttonsRef.current.querySelector(`[data-index="${playingChord}"]`);
        if (el) {
          requestAnimationFrame(() => {
            el.removeAttribute('data-playing');
            requestAnimationFrame(() => {
              el.setAttribute('data-playing', 'true');
            });
          });
        }
      }
    } catch (_e) {}
  }, [playingChord]);

  return (
    <div className="ChordButtons" ref={buttonsRef} onContextMenu={ (e) => e.preventDefault() }>
      { chords.map(([name], i) => (
        <button className="ChordButton" data-index={i} key={i} onPointerDown={(event) => handleClick(event, i)}>
          <div className="ChordButton__name">{name}</div>
          <div className="ChordButton__shortcut"> <Shortcuts chordIndex={i} /> </div>
        </button>
      ))}
    </div>
  )
};
