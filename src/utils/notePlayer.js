import samples from '@/assets/samples';
import createSoundPlayer from './createSoundPlayer';

const allNotes = Object.fromEntries(
  Object.keys(samples).map((note) => {
    return [note, createSoundPlayer(samples[note])];
  })
);

export default (notes) => {
  Object.keys(allNotes).forEach((note) => allNotes[note].stop());
  notes.forEach((note) => allNotes[note].play());
}