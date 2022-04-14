import { useState } from 'react';
import './App.css';
import notePlayer from '@/utils/notePlayer';
import ChordButtons from '@/components/ChordButtons/index.jsx';

export default () => {
  const [playingChord, setPlayingChord] = useState(null);

  const playChord = ({ name, notes }) => {
    setPlayingChord(name);
    notePlayer(notes);
  };

  return (
    <div className='App'>
      <ChordButtons 
        listenGlobalKeys={ true }
        onPlay={ playChord }
        playingChord={ playingChord }
      />
    </div>
  )
};
