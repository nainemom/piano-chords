const octaveOrderWithAlternatives = [
    ['C', 'Dbb', 'B#'],
    ['Db', 'C#'],
    ['D', 'Ebb'],
    ['Eb', 'D#'],
    ['E', 'Fb'],
    ['F', 'Gbb', 'E#'],
    ['Gb', 'F#'],
    ['G', 'Abb'],
    ['Ab', 'G#'],
    ['A', 'Bbb'],
    ['Bb', 'A#'],
    ['B', 'Cb'],
];

const octaveOrder = octaveOrderWithAlternatives.map((note) => note[0]);


const chordsWithNamesLegacy = `C major – C E G
C# major – C# E# G#
D major – D F# A
Eb major – Eb G Bb
E major – E G# B
F major – F A C
F# major – F# A# C#
G major – G B D
Ab major – Ab C Eb
A major – A C# E
Bb major – Bb D F
B major – B D# F#
C minor – C Eb G
C# minor – C# E G#
D minor – D F A
Eb minor – Eb Gb Bb
E minor – E G B
F minor – F Ab C
F# minor – F# A C#
G minor – G Bb D
Ab minor – Ab Cb(B) Eb
A minor – A C E
Bb minor – Bb Db F
B minor – B D F#
C diminished – C Eb Gb
C# diminished – C# E G
D diminished – D F Ab
Eb diminished – Eb Gb Bbb(A)
E diminished – E G Bb
F diminished – F Ab Cb(B)
F# diminished – F# A C
G diminished – G Bb Db
Ab diminished – Ab Cb Ebb(D)
A diminished – A C Eb
Bb diminished – Bb Db Fb(E)
B diminished – B D F
C major seventh – C E G B
C# major seventh – C# E#(F) G# B#(C)
D major seventh – D F# A C#
Eb major seventh – Eb G Bb D
E major seventh – E G# B D#
F major seventh – F A C E
F# major seventh – F# A# C# E#(F)
G major seventh – G B D F#
Ab major seventh – Ab C Eb G
A major seventh – A C# E G#
Bb major seventh – Bb D F A
B major seventh – B D# F# A#
C dominant seventh – C E G Bb
C# dominant seventh – C# E#(F) G# B
D dominant seventh – D F# A C
Eb dominant seventh – Eb G Bb Db
E dominant seventh – E G# B D
F dominant seventh – F A C Eb
F# dominant seventh – F# A# C# E
G dominant seventh – G B D F
Ab dominant seventh – Ab C Eb Gb
A dominant seventh – A C# E G
Bb dominant seventh – Bb D F Ab
B dominant seventh – B D# F# A
C minor seventh – C Eb G Bb
C# minor seventh – C# E G# B
D minor seventh – D F A C
Eb minor seventh – Eb Gb Bb Db
E minor seventh – E G B D
F minor seventh – F Ab C Eb
F# minor seventh – F# A C# E
G minor seventh – G Bb D F
Ab minor seventh – Ab Cb(B) Eb Gb
A minor seventh – A C E G
Bb minor seventh – Bb Db F Ab
B minor seventh – B D F# A
C minor seventh flat five – C Eb Gb Bb
C# minor seventh flat five – C# E G B
D minor seventh flat five – D F Ab C
Eb minor seventh flat five – Eb Gb Bbb(A) Db
E minor seventh flat five – E G Bb D
F minor seventh flat five – F Ab Cb(B) Eb
F# minor seventh flat five – F# A C E
G minor seventh flat five – G Bb Db F
Ab minor seventh flat five – Ab Cb Ebb(D) Gb
A minor seventh flat five – A C Eb G
Bb minor seventh flat five – Bb Db Fb(E) Ab
B minor seventh flat five – B D F A`;

const chords = chordsWithNamesLegacy
    .split('\n')
    .map((legacyChordWithName) => legacyChordWithName
        .split('–')
        .map(x => x.trim())
    )
    .map(([name, legacyChord]) => [
        name,
        legacyChord.split(' ').map((legacyNote) => {
            return legacyNote.trim();
        })
    ])
    .map(([name, badChord]) => {
        const correctChord = badChord.map((noteWithBadName) => {
            let note = noteWithBadName;
            if (note.includes('(')) {
                note = note.slice(0, note.indexOf('('));
            }

            try {
                return octaveOrderWithAlternatives.filter(noteNames => noteNames.includes(note))[0][0];
            } catch (_e) {
                throw new Error(noteWithBadName);
            }
        });
        return [name, correctChord];
    })
    .map(([name, chordNoOctave]) => {
        // let startFrom = 2;
        // let currentNoteIndex = 0;
        // chordNoOctave.forEach((note) => {
        //     const noteIndex = octaveOrder.indexOf(note);
        //     if (noteIndex < currentNoteIndex) {
        //         startFrom = 1;
        //     }
        //     currentNoteIndex = noteIndex;
        // });

        //
        startFrom = 1;
        //

        const chordOctaves = [1, 2].map((startFrom) => {
          let currentNoteIndex = 0;
          let startFromValue = startFrom;
          return chordNoOctave.map((note) => {
              const noteIndex = octaveOrder.indexOf(note);
              if (noteIndex < currentNoteIndex) {
                startFromValue+=1;
              }
              currentNoteIndex = noteIndex;
              return `${note}${startFromValue}`;
          });
        });

        return [name, chordOctaves];
    })

console.log(JSON.stringify(chords));


let sampleFiles = ``;
let sampleFilesExportList = [];
octaveOrder.forEach((noteWithoutOctave) => {
  [`${noteWithoutOctave}1`, `${noteWithoutOctave}2`, `${noteWithoutOctave}3`].forEach((note) => {
    sampleFiles += `import ${note} from './${note}.mp3?inline';\n`;
    sampleFilesExportList.push(note);
  });
});

console.log(sampleFiles + '\n' + `export default { ${sampleFilesExportList.join(', ') } };`)