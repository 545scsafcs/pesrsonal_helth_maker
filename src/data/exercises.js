import gobletSquatSvg from '../assets/exercises/goblet_squat.svg';
import rdlSvg from '../assets/exercises/romanian_deadlift.svg';
import floorPressSvg from '../assets/exercises/floor_press.svg';
import oneArmRowSvg from '../assets/exercises/one_arm_row.svg';
import shoulderPressSvg from '../assets/exercises/shoulder_press.svg';
import dumbbellCurlSvg from '../assets/exercises/dumbbell_curl.svg';
import tricepsExtensionSvg from '../assets/exercises/triceps_extension.svg';
import calfRaiseSvg from '../assets/exercises/calf_raise.svg';
import bulgarianSplitSquatSvg from '../assets/exercises/bulgarian_split_squat.svg';
import singleLegRdlSvg from '../assets/exercises/single_leg_rdl.svg';
import pushupSvg from '../assets/exercises/pushup.svg';
import lateralRaiseSvg from '../assets/exercises/lateral_raise.svg';
import hammerCurlSvg from '../assets/exercises/hammer_curl.svg';
import plankSvg from '../assets/exercises/plank.svg';

export const CATEGORIES = [
  'All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Hamstrings', 'Calves', 'Core', 'Full Body', 'Mobility'
];

export const EQUIPMENTS = ['All', 'Bodyweight', '5 kg dumbbells', '12 kg dumbbell', 'Dumbbells'];
export const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const EXERCISES = [
  // --- CHEST (10 Exercises) ---
  {
    id: 'pushup',
    name: 'Push-Up',
    category: 'Chest',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    target: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 60,
    sets: 3,
    reps: '10–15',
    restSeconds: 60,
    image: pushupSvg,
    instructions: [
      'Start in a plank position with hands slightly wider than shoulder-width.',
      'Keep body in a straight line from head to heels.',
      'Lower chest toward the floor until elbows reach 90 degrees.',
      'Push firmly back up to starting position.'
    ],
    tips: ['Keep core tight', 'Elbows at 45-degree angle', 'Avoid sagging hips']
  },
  {
    id: 'wide-pushup',
    name: 'Wide Push-Up',
    category: 'Chest',
    muscleGroups: ['Outer Chest', 'Shoulders', 'Core'],
    target: ['Outer Chest', 'Shoulders', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Set hands significantly wider than shoulder-width apart.',
      'Keep core braced and body straight.',
      'Lower chest to 2 inches off the ground.',
      'Press through outer chest to return to top.'
    ],
    tips: ['Focus on chest stretch at the bottom', 'Keep neck neutral']
  },
  {
    id: 'close-grip-pushup',
    name: 'Close-Grip Push-Up',
    category: 'Chest',
    muscleGroups: ['Inner Chest', 'Triceps', 'Core'],
    target: ['Inner Chest', 'Triceps', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12',
    defaultRest: 60,
    sets: 3,
    reps: '8–12',
    restSeconds: 60,
    instructions: [
      'Place hands directly under your chest, closer than shoulder-width.',
      'Lower chest while keeping elbows tucked close to your ribcage.',
      'Push back up emphasizing triceps and inner chest.'
    ],
    tips: ['Keep elbows tucked', 'Engage abs to prevent hip sagging']
  },
  {
    id: 'diamond-pushup',
    name: 'Diamond Push-Up',
    category: 'Chest',
    muscleGroups: ['Inner Chest', 'Triceps'],
    target: ['Inner Chest', 'Triceps'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–10',
    defaultRest: 60,
    sets: 3,
    reps: '8–10',
    restSeconds: 60,
    instructions: [
      'Form a diamond shape with thumbs and index fingers under your chest.',
      'Lower chest directly over the diamond shape.',
      'Press up with control focusing on triceps peak contraction.'
    ],
    tips: ['Lower knees if form breaks', 'Squeeze chest at top']
  },
  {
    id: 'incline-pushup',
    name: 'Incline Push-Up',
    category: 'Chest',
    muscleGroups: ['Lower Chest', 'Triceps'],
    target: ['Lower Chest', 'Triceps'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Place hands on an elevated surface like a bed, chair, or sturdy box.',
      'Keep body straight and lower chest to touch the edge.',
      'Press up smoothly.'
    ],
    tips: ['Great for warm-ups or beginners building push strength']
  },
  {
    id: 'decline-pushup',
    name: 'Decline Push-Up',
    category: 'Chest',
    muscleGroups: ['Upper Chest', 'Front Delts'],
    target: ['Upper Chest', 'Front Delts'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12',
    defaultRest: 60,
    sets: 3,
    reps: '8–12',
    restSeconds: 60,
    instructions: [
      'Place feet up on a bed or chair with hands flat on the floor.',
      'Lower head and chest toward floor in controlled manner.',
      'Push up focusing on upper chest contraction.'
    ],
    tips: ['Keep core super tight to avoid lower back arching']
  },
  {
    id: 'floor-press',
    name: 'Dumbbell Floor Press',
    category: 'Chest',
    muscleGroups: ['Chest', 'Triceps'],
    target: ['Chest', 'Triceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 60,
    sets: 3,
    reps: '10–15',
    restSeconds: 60,
    image: floorPressSvg,
    instructions: [
      'Lie flat on the floor with knees bent and feet on floor.',
      'Hold dumbbells at chest level with elbows at 45 degrees.',
      'Press dumbbells overhead until arms extend.',
      'Lower until upper arms lightly touch the floor.'
    ],
    tips: ['Pause 1 second at floor contact before pressing']
  },
  {
    id: 'squeeze-press',
    name: 'Dumbbell Squeeze Press',
    category: 'Chest',
    muscleGroups: ['Inner Chest', 'Triceps'],
    target: ['Inner Chest', 'Triceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Lie on floor pressing two dumbbells together over your chest.',
      'Actively crush the dumbbells into each other continuously.',
      'Lower to chest while maintaining inward pressure, then press up.'
    ],
    tips: ['Constant inward pressure creates intense inner chest burn']
  },
  {
    id: 'single-arm-floor-press',
    name: 'Single-Arm Dumbbell Floor Press',
    category: 'Chest',
    muscleGroups: ['Chest', 'Core', 'Triceps'],
    target: ['Chest', 'Core', 'Triceps'],
    equipment: '12 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12 each arm',
    defaultRest: 60,
    sets: 3,
    reps: '8–12 each arm',
    restSeconds: 60,
    instructions: [
      'Lie on floor holding a single 12 kg dumbbell in one hand.',
      'Brace core to prevent rotational torso sway.',
      'Press dumbbell up and lower under control until elbow touches floor.'
    ],
    tips: ['Anti-rotation core challenge alongside chest press']
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'Chest',
    muscleGroups: ['Chest', 'Lats', 'Serratus'],
    target: ['Chest', 'Lats', 'Serratus'],
    equipment: '12 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Lie flat holding 12 kg dumbbell vertically over chest with both hands.',
      'Slight bend in elbows, lower dumbbell back over head toward floor.',
      'Pull dumbbell back up over chest using chest and lats.'
    ],
    tips: ['Deep stretch at bottom, squeeze chest at top']
  },

  // --- BACK (10 Exercises) ---
  {
    id: 'one-arm-row',
    name: 'One-Arm Dumbbell Row',
    category: 'Back',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
    target: ['Back', 'Biceps', 'Core'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–15 each side',
    defaultRest: 60,
    sets: 3,
    reps: '10–15 each side',
    restSeconds: 60,
    image: oneArmRowSvg,
    instructions: [
      'Support hand and knee on bed/chair.',
      'Hold 12 kg dumbbell in free hand hanging down.',
      'Pull dumbbell to hip, squeezing shoulder blade at top.'
    ],
    tips: ['Pull toward hip, not shoulder']
  },
  {
    id: 'bent-over-row',
    name: 'Bent-Over Dumbbell Row',
    category: 'Back',
    muscleGroups: ['Upper Back', 'Lats', 'Rear Delts'],
    target: ['Upper Back', 'Lats', 'Rear Delts'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Hinge at hips to 45 degrees holding two 5 kg dumbbells.',
      'Keep flat spine, row dumbbells to waist.',
      'Squeeze upper back muscles together.'
    ],
    tips: ['Do not round lower back']
  },
  {
    id: 'two-dumbbell-row',
    name: 'Two-Dumbbell Heavy Row',
    category: 'Back',
    muscleGroups: ['Lats', 'Mid Back'],
    target: ['Lats', 'Mid Back'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Hinge forward parallel to floor with knees slightly bent.',
      'Pull both dumbbells symmetrically into lower ribs.',
      'Lower slowly.'
    ],
    tips: ['Hold top contraction for 1 second']
  },
  {
    id: 'renegade-row',
    name: 'Renegade Row',
    category: 'Back',
    muscleGroups: ['Back', 'Core', 'Obliques'],
    target: ['Back', 'Core', 'Obliques'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Advanced',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–10 each arm',
    defaultRest: 90,
    sets: 3,
    reps: '8–10 each arm',
    restSeconds: 90,
    instructions: [
      'Start in high plank holding 5 kg dumbbells on floor.',
      'Row one dumbbell to hip while bracing core against hips twisting.',
      'Alternate arms smoothly.'
    ],
    tips: ['Keep feet wide for balance']
  },
  {
    id: 'reverse-fly',
    name: 'Reverse Fly',
    category: 'Back',
    muscleGroups: ['Rear Delts', 'Rhomboids'],
    target: ['Rear Delts', 'Rhomboids'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Bent over at hips holding dumbbells under chest.',
      'Raise arms out to sides with slight elbow bend like wings.',
      'Squeeze shoulder blades.'
    ],
    tips: ['Use light weight to target rear delts accurately']
  },
  {
    id: 'superman',
    name: 'Superman',
    category: 'Back',
    muscleGroups: ['Erector Spinae', 'Glutes'],
    target: ['Erector Spinae', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Lie face down with arms extended forward.',
      'Lift arms, chest, and thighs off floor simultaneously.',
      'Hold 2 seconds at top, then lower.'
    ],
    tips: ['Focus on squeezing glutes and lower back']
  },
  {
    id: 'bird-dog-row',
    name: 'Bird Dog Row',
    category: 'Back',
    muscleGroups: ['Lats', 'Core Balance'],
    target: ['Lats', 'Core Balance'],
    equipment: '5 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each side',
    defaultRest: 60,
    sets: 3,
    reps: '10 each side',
    restSeconds: 60,
    instructions: [
      'On hands and knees, extend left leg straight back.',
      'Hold 5 kg dumbbell in right hand and row up to hip.',
      'Maintain stable horizontal spine.'
    ],
    tips: ['Excellent stability and lats isolation']
  },
  {
    id: 'prone-y-raise',
    name: 'Prone Y-Raise',
    category: 'Back',
    muscleGroups: ['Lower Traps', 'Upper Back'],
    target: ['Lower Traps', 'Upper Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Lie prone on floor, arms out in Y shape with thumbs up.',
      'Lift arms upward squeezing lower traps.',
      'Lower with control.'
    ],
    tips: ['Improves posture and shoulder health']
  },
  {
    id: 'prone-w-raise',
    name: 'Prone W-Raise',
    category: 'Back',
    muscleGroups: ['Rhomboids', 'Mid Traps'],
    target: ['Rhomboids', 'Mid Traps'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Lie prone, bend elbows into W shape.',
      'Squeeze shoulder blades together lifting arms off floor.',
      'Hold 2 seconds.'
    ],
    tips: ['Focus on scapular retraction']
  },
  {
    id: 'good-morning-bw',
    name: 'Good Morning (Bodyweight)',
    category: 'Back',
    muscleGroups: ['Lower Back', 'Hamstrings'],
    target: ['Lower Back', 'Hamstrings'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45,
    sets: 3,
    reps: '15',
    restSeconds: 45,
    instructions: [
      'Hands behind head, stand tall.',
      'Hinge forward at hips pushing butt back with flat spine.',
      'Return up squeezing glutes.'
    ],
    tips: ['Never round spine']
  },

  // --- SHOULDERS (10 Exercises) ---
  {
    id: 'shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'Shoulders',
    muscleGroups: ['Front Delts', 'Side Delts', 'Triceps'],
    target: ['Shoulders', 'Triceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    image: shoulderPressSvg,
    instructions: [
      'Hold dumbbells at shoulder height with palms forward.',
      'Press straight up until arms extend overhead.',
      'Lower slowly to shoulder level.'
    ],
    tips: ['Keep core braced, avoid leaning back']
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    category: 'Shoulders',
    muscleGroups: ['Front Delts', 'Side Delts', 'Rear Delts'],
    target: ['Front Delts', 'Side Delts', 'Rear Delts'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Start with dumbbells at chest, palms facing towards you.',
      'As you press up, rotate wrists so palms face forward at top.',
      'Reverse rotation on descent.'
    ],
    tips: ['Smooth rotation throughout movement']
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    muscleGroups: ['Side Delts'],
    target: ['Side Delts', 'Shoulders'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    image: lateralRaiseSvg,
    instructions: [
      'Hold dumbbells at sides with slight elbow bend.',
      'Raise out to sides to shoulder height.',
      'Lower with control.'
    ],
    tips: ['Lead with elbows, do not swing weight']
  },
  {
    id: 'front-raise',
    name: 'Dumbbell Front Raise',
    category: 'Shoulders',
    muscleGroups: ['Front Delts'],
    target: ['Front Delts'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Hold dumbbells in front of thighs.',
      'Raise one or both arms straight forward to shoulder level.',
      'Lower under control.'
    ],
    tips: ['Keep torso stationary']
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    category: 'Shoulders',
    muscleGroups: ['Rear Delts', 'Upper Back'],
    target: ['Rear Delts', 'Upper Back'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Bent over torso to 45 degrees.',
      'Raise arms wide out to sides focusing on rear shoulder squeeze.',
      'Lower slowly.'
    ],
    tips: ['Keep elbows slightly soft']
  },
  {
    id: 'bent-over-rear-delt-raise',
    name: 'Bent-Over Rear Delt Raise',
    category: 'Shoulders',
    muscleGroups: ['Rear Delts'],
    target: ['Rear Delts'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Hinge until torso is nearly parallel to floor.',
      'Raise arms in arc to ceiling.',
      'Pause for 1 sec at top.'
    ],
    tips: ['Strict isolation exercise']
  },
  {
    id: 'pike-pushup',
    name: 'Pike Push-Up',
    category: 'Shoulders',
    muscleGroups: ['Front Delts', 'Triceps', 'Upper Chest'],
    target: ['Front Delts', 'Triceps'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12',
    defaultRest: 60,
    sets: 3,
    reps: '8–12',
    restSeconds: 60,
    instructions: [
      'From plank, walk feet in until hips pike up forming V shape.',
      'Lower head forward toward floor between hands.',
      'Press back up up to pike.'
    ],
    tips: ['Great bodyweight shoulder builder']
  },
  {
    id: 'alternating-db-press',
    name: 'Alternating Dumbbell Press',
    category: 'Shoulders',
    muscleGroups: ['Shoulders', 'Core'],
    target: ['Shoulders', 'Core'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each side',
    defaultRest: 60,
    sets: 3,
    reps: '10 each side',
    restSeconds: 60,
    instructions: [
      'Hold dumbbells at shoulders.',
      'Press right arm up, lower it, then press left arm up.',
      'Keep core engaged.'
    ],
    tips: ['Maintains overhead tension']
  },
  {
    id: 'upright-row',
    name: 'Upright Dumbbell Row',
    category: 'Shoulders',
    muscleGroups: ['Side Delts', 'Traps'],
    target: ['Side Delts', 'Traps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Hold dumbbells in front of thighs close together.',
      'Pull dumbbells up toward chest leading with elbows higher than hands.',
      'Lower under control.'
    ],
    tips: ['Stop at chest level, don\'t force higher']
  },
  {
    id: 'dumbbell-shrug',
    name: 'Dumbbell Shrug',
    category: 'Shoulders',
    muscleGroups: ['Upper Traps'],
    target: ['Upper Traps'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45,
    sets: 3,
    reps: '15',
    restSeconds: 45,
    instructions: [
      'Hold 12 kg dumbbell or two dumbbells at sides.',
      'Elevate shoulders straight up to ears.',
      'Hold 2 seconds at top, then lower.'
    ],
    tips: ['Do not roll shoulders backward']
  },

  // --- BICEPS (8 Exercises) ---
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    category: 'Biceps',
    muscleGroups: ['Biceps', 'Brachialis'],
    target: ['Biceps', 'Forearms'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 60,
    sets: 3,
    reps: '10–15',
    restSeconds: 60,
    image: dumbbellCurlSvg,
    instructions: [
      'Stand with dumbbells at sides, palms facing forward.',
      'Curl dumbbells to shoulder height.',
      'Squeeze biceps at top and lower with control.'
    ],
    tips: ['Pin elbows to ribcage']
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    category: 'Biceps',
    muscleGroups: ['Brachialis', 'Biceps', 'Forearms'],
    target: ['Biceps', 'Brachialis', 'Forearms'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 60,
    sets: 3,
    reps: '10–15',
    restSeconds: 60,
    image: hammerCurlSvg,
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other).',
      'Curl up toward shoulders maintaining neutral grip.',
      'Lower slowly.'
    ],
    tips: ['Builds arm thickness and grip strength']
  },
  {
    id: 'alt-db-curl',
    name: 'Alternating Dumbbell Curl',
    category: 'Biceps',
    muscleGroups: ['Biceps'],
    target: ['Biceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10 each arm',
    defaultRest: 60,
    sets: 3,
    reps: '10 each arm',
    restSeconds: 60,
    instructions: [
      'Curl one arm at a time, supinating wrist (turning palm up) as you rise.',
      'Lower fully before curling opposite arm.'
    ],
    tips: ['Maximizes bicep peak contraction']
  },
  {
    id: 'concentration-curl',
    name: 'Concentration Curl',
    category: 'Biceps',
    muscleGroups: ['Biceps Peak'],
    target: ['Biceps Peak'],
    equipment: '5 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12 each arm',
    defaultRest: 45,
    sets: 3,
    reps: '12 each arm',
    restSeconds: 45,
    instructions: [
      'Seated on chair, brace elbow against inner thigh.',
      'Curl 5 kg dumbbell toward shoulder.',
      'Squeeze hard at top.'
    ],
    tips: ['Eliminates momentum completely']
  },
  {
    id: 'cross-body-hammer-curl',
    name: 'Cross-Body Hammer Curl',
    category: 'Biceps',
    muscleGroups: ['Brachialis', 'Forearms'],
    target: ['Brachialis', 'Forearms'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12 each side',
    defaultRest: 45,
    sets: 3,
    reps: '12 each side',
    restSeconds: 45,
    instructions: [
      'Hold dumbbell with neutral grip.',
      'Curl weight across chest toward opposite shoulder.',
      'Lower back to starting side.'
    ],
    tips: ['Targets brachialis for arm width']
  },
  {
    id: 'zottman-curl',
    name: 'Zottman Curl',
    category: 'Biceps',
    muscleGroups: ['Biceps', 'Forearm Extensors'],
    target: ['Biceps', 'Forearms'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Curl up with palms facing up (underhand).',
      'At top, rotate wrists so palms face down (overhand).',
      'Lower weight slowly with overhand grip.'
    ],
    tips: ['Hits biceps on way up, forearms on way down']
  },
  {
    id: 'reverse-db-curl',
    name: 'Reverse Dumbbell Curl',
    category: 'Biceps',
    muscleGroups: ['Forearms', 'Brachioradialis'],
    target: ['Forearms', 'Biceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Hold dumbbells with overhand grip (palms facing down).',
      'Curl up keeping overhand grip.',
      'Lower slowly.'
    ],
    tips: ['Builds formidable forearm thickness']
  },
  {
    id: 'iso-curl-hold',
    name: 'Isometric Dumbbell Curl Hold',
    category: 'Biceps',
    muscleGroups: ['Biceps Endurance'],
    target: ['Biceps Endurance'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '30 seconds',
    defaultRest: 60,
    sets: 3,
    reps: '30 seconds',
    restSeconds: 60,
    instructions: [
      'Curl dumbbells up to 90 degrees elbow bend.',
      'Hold position statically for 30 seconds.',
      'Maintain strong bicep tension.'
    ],
    tips: ['Great finisher exercise']
  },

  // --- TRICEPS (8 Exercises) ---
  {
    id: 'triceps-extension',
    name: 'Overhead Dumbbell Triceps Extension',
    category: 'Triceps',
    muscleGroups: ['Triceps Long Head'],
    target: ['Triceps'],
    equipment: '5 kg or 12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 60,
    sets: 3,
    reps: '10–15',
    restSeconds: 60,
    image: tricepsExtensionSvg,
    instructions: [
      'Hold dumbbell behind head with both hands.',
      'Extend arms overhead straight up.',
      'Lower carefully behind head.'
    ],
    tips: ['Keep elbows tucked forward']
  },
  {
    id: 'two-hand-overhead-ext',
    name: 'Two-Hand Overhead Extension',
    category: 'Triceps',
    muscleGroups: ['Triceps'],
    target: ['Triceps'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Hold heavy 12 kg dumbbell under top plate with both hands.',
      'Press straight overhead overhead.',
      'Lower until deep triceps stretch behind neck.'
    ],
    tips: ['Keep core braced to protect lower back']
  },
  {
    id: 'single-arm-overhead-ext',
    name: 'Single-Arm Overhead Extension',
    category: 'Triceps',
    muscleGroups: ['Triceps Long Head'],
    target: ['Triceps Long Head'],
    equipment: '5 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12 each arm',
    defaultRest: 45,
    sets: 3,
    reps: '12 each arm',
    restSeconds: 45,
    instructions: [
      'Hold single 5 kg dumbbell overhead in one hand.',
      'Lower behind opposite shoulder.',
      'Extend straight up.'
    ],
    tips: ['Isolates left and right triceps independently']
  },
  {
    id: 'db-skull-crusher',
    name: 'Dumbbell Skull Crusher',
    category: 'Triceps',
    muscleGroups: ['Triceps Lateral Head'],
    target: ['Triceps'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Lie flat on floor holding dumbbells over chest.',
      'Hinge at elbows lowering dumbbells to sides of forehead.',
      'Extend back up to top.'
    ],
    tips: ['Keep upper arms vertical throughout']
  },
  {
    id: 'db-kickback',
    name: 'Dumbbell Kickback',
    category: 'Triceps',
    muscleGroups: ['Triceps Peak'],
    target: ['Triceps Peak'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Bent over parallel to floor, elbows pulled to torso.',
      'Extend dumbbells backward until arms straight.',
      'Squeeze triceps 1 sec, return.'
    ],
    tips: ['Do not drop upper arms']
  },
  {
    id: 'tate-press',
    name: 'Tate Press',
    category: 'Triceps',
    muscleGroups: ['Triceps Medial Head'],
    target: ['Triceps Medial Head'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Lying on floor with dumbbells touching on chest.',
      'Flaring elbows out, press dumbbells outward and up.',
      'Lower heads of dumbbells back to center of chest.'
    ],
    tips: ['Unique triceps lockout builder']
  },

  // --- LEGS (12 Exercises) ---
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    target: ['Quadriceps', 'Glutes', 'Core'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 90,
    sets: 3,
    reps: '10–15',
    restSeconds: 90,
    image: gobletSquatSvg,
    instructions: [
      'Hold 12 kg dumbbell vertically against chest.',
      'Squat down between knees keeping chest up.',
      'Drive through heels to stand.'
    ],
    tips: ['Keep elbows tucked inside knees at bottom']
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes'],
    target: ['Quadriceps', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '15–20',
    defaultRest: 45,
    sets: 3,
    reps: '15–20',
    restSeconds: 45,
    instructions: [
      'Feet shoulder-width apart.',
      'Lower hips back and down to 90 degrees.',
      'Stand up smoothly.'
    ],
    tips: ['Great warm-up exercise']
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes', 'Balance'],
    target: ['Quadriceps', 'Glutes', 'Balance'],
    equipment: 'Bodyweight (or 5 kg dumbbells)',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12 each leg',
    defaultRest: 90,
    sets: 3,
    reps: '8–12 each leg',
    restSeconds: 90,
    image: bulgarianSplitSquatSvg,
    instructions: [
      'Elevate back foot on bed or chair.',
      'Lower front knee until thigh parallel to floor.',
      'Drive up through front heel.'
    ],
    tips: ['Keep torso upright']
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    target: ['Quadriceps', 'Glutes'],
    equipment: 'Bodyweight (or dumbbells)',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each leg',
    defaultRest: 60,
    sets: 3,
    reps: '10 each leg',
    restSeconds: 60,
    instructions: [
      'Step back with one leg, lowering rear knee toward floor.',
      'Push off front leg to return to standing.'
    ],
    tips: ['Easier on knees than forward lunges']
  },
  {
    id: 'forward-lunge',
    name: 'Forward Lunge',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes'],
    target: ['Quadriceps', 'Glutes'],
    equipment: 'Bodyweight (or dumbbells)',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each leg',
    defaultRest: 60,
    sets: 3,
    reps: '10 each leg',
    restSeconds: 60,
    instructions: [
      'Step forward into lunge lowering back knee.',
      'Push off front foot to step back.'
    ],
    tips: ['Keep front knee behind toes']
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'Legs',
    muscleGroups: ['Quads', 'Glutes', 'Cardio'],
    target: ['Quads', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12 steps each side',
    defaultRest: 60,
    sets: 3,
    reps: '12 steps each side',
    restSeconds: 60,
    instructions: [
      'Lunge forward stepping through into next lunge continuously.',
      'Maintain steady rhythmic stride across room.'
    ],
    tips: ['Builds leg conditioning']
  },
  {
    id: 'split-squat',
    name: 'Stationary Split Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes'],
    target: ['Quadriceps', 'Glutes'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each leg',
    defaultRest: 60,
    sets: 3,
    reps: '10 each leg',
    restSeconds: 60,
    instructions: [
      'Staggered stance feet planted flat.',
      'Lower straight down and push straight up without stepping.'
    ],
    tips: ['Great for building single-leg strength']
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squat',
    category: 'Legs',
    muscleGroups: ['Inner Thighs', 'Glutes', 'Quads'],
    target: ['Inner Thighs', 'Glutes'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Wide stance with toes pointed out 45 degrees.',
      'Hold 12 kg dumbbell down between legs.',
      'Squat deep driving knees outward.'
    ],
    tips: ['Targets adductors and glutes']
  },
  {
    id: 'db-front-squat',
    name: 'Dumbbell Front Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Core'],
    target: ['Quadriceps', 'Core'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 90,
    sets: 3,
    reps: '10–12',
    restSeconds: 90,
    instructions: [
      'Rack two 5 kg dumbbells on front shoulders.',
      'Squat deep maintaining vertical chest.',
      'Drive up through heels.'
    ],
    tips: ['High quad activation']
  },
  {
    id: 'squat-pulse',
    name: 'Squat Pulse',
    category: 'Legs',
    muscleGroups: ['Quadriceps Burn'],
    target: ['Quadriceps Burn'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '20 pulses',
    defaultRest: 45,
    sets: 3,
    reps: '20 pulses',
    restSeconds: 45,
    instructions: [
      'Lower into deep squat.',
      'Pulse up and down 2–3 inches continuously without standing full.'
    ],
    tips: ['Creates massive quad pump']
  },
  {
    id: 'step-up',
    name: 'Step-Up',
    category: 'Legs',
    muscleGroups: ['Quads', 'Glutes'],
    target: ['Quads', 'Glutes'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10 each leg',
    defaultRest: 60,
    sets: 3,
    reps: '10 each leg',
    restSeconds: 60,
    instructions: [
      'Step up onto sturdy box, bed, or step.',
      'Drive through top heel to raise body.',
      'Step down with control.'
    ],
    tips: ['Minimize pushing off rear leg']
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'Legs',
    muscleGroups: ['Quadriceps Isometric'],
    target: ['Quadriceps Isometric'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '45 seconds',
    defaultRest: 60,
    sets: 3,
    reps: '45 seconds',
    restSeconds: 60,
    instructions: [
      'Back flat against wall, slide down to 90 degree knees.',
      'Hold position statically.'
    ],
    tips: ['Keep thighs parallel to ground']
  },

  // --- HAMSTRINGS / GLUTES (10 Exercises) ---
  {
    id: 'romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift',
    category: 'Hamstrings',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    target: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–15',
    defaultRest: 90,
    sets: 3,
    reps: '10–15',
    restSeconds: 90,
    image: rdlSvg,
    instructions: [
      'Hold 12 kg dumbbell at thighs.',
      'Hinge at hips pushing butt back with flat spine.',
      'Lower to mid-shin feeling hamstring stretch, then squeeze glutes to stand.'
    ],
    tips: ['Keep weight close to body']
  },
  {
    id: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift',
    category: 'Hamstrings',
    muscleGroups: ['Hamstrings', 'Glutes', 'Balance'],
    target: ['Hamstrings', 'Glutes', 'Balance'],
    equipment: '12 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–12 each leg',
    defaultRest: 90,
    sets: 3,
    reps: '8–12 each leg',
    restSeconds: 90,
    image: singleLegRdlSvg,
    instructions: [
      'Stand on one leg holding 12 kg dumbbell.',
      'Hinge hip extending rear leg straight back.',
      'Return to standing by glute drive.'
    ],
    tips: ['Touch wall if balance falters']
  },
  {
    id: 'stiff-leg-deadlift',
    name: 'Dumbbell Stiff-Leg Deadlift',
    category: 'Hamstrings',
    muscleGroups: ['Hamstrings Peak Stretch'],
    target: ['Hamstrings'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Keep legs nearly straight (minimal knee flex).',
      'Hinge deep at hips lowering dumbbells toward toes.',
      'Squeeze hamstrings to stand.'
    ],
    tips: ['Focus on maximal hamstring stretch']
  },
  {
    id: 'db-hip-thrust',
    name: 'Dumbbell Hip Thrust',
    category: 'Glutes',
    muscleGroups: ['Glutes', 'Hamstrings'],
    target: ['Glutes', 'Hamstrings'],
    equipment: '12 kg dumbbell',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 60,
    sets: 3,
    reps: '12–15',
    restSeconds: 60,
    instructions: [
      'Upper back against bed/couch, 12 kg dumbbell on hips.',
      'Drive hips up squeezing glutes hard at top.',
      'Lower under control.'
    ],
    tips: ['Tuck chin and lock out glutes at top']
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'Glutes',
    muscleGroups: ['Glutes'],
    target: ['Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15–20',
    defaultRest: 45,
    sets: 3,
    reps: '15–20',
    restSeconds: 45,
    instructions: [
      'Lie flat on back with knees bent.',
      'Drive hips up through heels squeezing glutes at top.',
      'Hold 1 sec at top.'
    ],
    tips: ['Do not arch lower back']
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    category: 'Glutes',
    muscleGroups: ['Glutes', 'Hamstrings'],
    target: ['Glutes', 'Hamstrings'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '10–12 each leg',
    defaultRest: 45,
    sets: 3,
    reps: '10–12 each leg',
    restSeconds: 45,
    instructions: [
      'Lie back, lift one leg straight in air.',
      'Drive hips up using remaining planted foot.',
      'Squeeze glute hard at peak.'
    ],
    tips: ['Keep hips level']
  },
  {
    id: 'frog-pump',
    name: 'Frog Pump',
    category: 'Glutes',
    muscleGroups: ['Glute Max & Medius'],
    target: ['Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '20–30',
    defaultRest: 45,
    sets: 3,
    reps: '20–30',
    restSeconds: 45,
    instructions: [
      'Lie flat on back, soles of feet pressed together (frog legs).',
      'Bridge hips up squeezing glutes.',
      'High rep glute burner.'
    ],
    tips: ['Keep soles pressed together']
  },
  {
    id: 'donkey-kick',
    name: 'Donkey Kick',
    category: 'Glutes',
    muscleGroups: ['Gluteus Maximus'],
    target: ['Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15 each leg',
    defaultRest: 45,
    sets: 3,
    reps: '15 each leg',
    restSeconds: 45,
    instructions: [
      'On all fours, kick one leg back and up keeping knee at 90 degrees.',
      'Squeeze glute at top.'
    ],
    tips: ['Keep hips facing down']
  },
  {
    id: 'fire-hydrant',
    name: 'Fire Hydrant',
    category: 'Glutes',
    muscleGroups: ['Gluteus Medius', 'Abductors'],
    target: ['Glutes', 'Abductors'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15 each leg',
    defaultRest: 45,
    sets: 3,
    reps: '15 each leg',
    restSeconds: 45,
    instructions: [
      'On all fours, raise bent leg out to side to hip height.',
      'Lower slowly.'
    ],
    tips: ['Great hip stability builder']
  },

  // --- CALVES (4 Exercises) ---
  {
    id: 'calf-raises',
    name: 'Standing Calf Raise',
    category: 'Calves',
    muscleGroups: ['Gastrocnemius', 'Soleus'],
    target: ['Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15–25',
    defaultRest: 45,
    sets: 3,
    reps: '15–25',
    restSeconds: 45,
    image: calfRaiseSvg,
    instructions: [
      'Stand tall and rise up high onto toes.',
      'Squeeze calves at top for 1 second.',
      'Lower heels slowly.'
    ],
    tips: ['Full range of motion']
  },
  {
    id: 'single-leg-calf-raise',
    name: 'Single-Leg Calf Raise',
    category: 'Calves',
    muscleGroups: ['Calves'],
    target: ['Calves'],
    equipment: 'Bodyweight (or 5 kg db)',
    difficulty: 'Intermediate',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '12–15 each leg',
    defaultRest: 45,
    sets: 3,
    reps: '12–15 each leg',
    restSeconds: 45,
    instructions: [
      'Stand on one leg, rise onto toes high.',
      'Lower heel slowly.'
    ],
    tips: ['Doubles the bodyweight load']
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    category: 'Calves',
    muscleGroups: ['Soleus'],
    target: ['Soleus', 'Calves'],
    equipment: '12 kg dumbbell',
    difficulty: 'Beginner',
    type: 'Isolation',
    defaultSets: 3,
    defaultReps: '15–20',
    defaultRest: 45,
    sets: 3,
    reps: '15–20',
    restSeconds: 45,
    instructions: [
      'Sit on chair with 12 kg dumbbell placed on knees.',
      'Raise heels off ground pushing into toes.',
      'Lower back down.'
    ],
    tips: ['Specifically targets soleus muscle']
  },
  {
    id: 'calf-raise-hold',
    name: 'Calf Raise Hold',
    category: 'Calves',
    muscleGroups: ['Calf Endurance'],
    target: ['Calf Endurance'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '30 seconds',
    defaultRest: 45,
    sets: 3,
    reps: '30 seconds',
    restSeconds: 45,
    instructions: [
      'Rise up onto toes and hold static position for 30 seconds.'
    ],
    tips: ['Ankle stability finisher']
  },

  // --- CORE (18 Exercises) ---
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Abs', 'Obliques', 'Transverse Abdominis'],
    target: ['Core', 'Shoulders', 'Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '30–60 seconds',
    defaultRest: 60,
    sets: 3,
    reps: '30–60 seconds',
    restSeconds: 60,
    image: plankSvg,
    instructions: [
      'Forearms on floor under shoulders.',
      'Hold straight line from head to heels.',
      'Brace core tight.'
    ],
    tips: ['Do not let hips sag']
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'Core',
    muscleGroups: ['Obliques'],
    target: ['Obliques', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '30 seconds each side',
    defaultRest: 45,
    sets: 3,
    reps: '30 seconds each side',
    restSeconds: 45,
    instructions: [
      'Lie on side, elbow under shoulder.',
      'Lift hips creating diagonal line.',
      'Hold static.'
    ],
    tips: ['Keep hips lifted high']
  },
  {
    id: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'Core',
    muscleGroups: ['Deep Core'],
    target: ['Deep Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '45 seconds',
    defaultRest: 45,
    sets: 3,
    reps: '45 seconds',
    restSeconds: 45,
    instructions: [
      'Forearms parallel on mat.',
      'Squeeze glutes and abs.'
    ],
    tips: ['Breathe steadily']
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Plank Shoulder Tap',
    category: 'Core',
    muscleGroups: ['Core Anti-Rotation'],
    target: ['Core Anti-Rotation'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '12 each side',
    defaultRest: 45,
    sets: 3,
    reps: '12 each side',
    restSeconds: 45,
    instructions: [
      'High plank position.',
      'Tap right hand to left shoulder, then left hand to right shoulder while keeping hips motionless.'
    ],
    tips: ['Do not sway hips side to side']
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'Core',
    muscleGroups: ['Abs', 'Cardio'],
    target: ['Abs', 'Cardio'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '30 seconds',
    defaultRest: 45,
    sets: 3,
    reps: '30 seconds',
    restSeconds: 45,
    instructions: [
      'From high plank, drive knees rapidly to chest in running motion.'
    ],
    tips: ['Keep hips low']
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    category: 'Core',
    muscleGroups: ['Obliques', 'Upper & Lower Abs'],
    target: ['Obliques', 'Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '15 each side',
    defaultRest: 45,
    sets: 3,
    reps: '15 each side',
    restSeconds: 45,
    instructions: [
      'Lie back, hands behind head.',
      'Touch right elbow to left knee while extending right leg.',
      'Alternate in twisting motion.'
    ],
    tips: ['Twist from ribcage, not neck']
  },
  {
    id: 'reverse-crunch',
    name: 'Reverse Crunch',
    category: 'Core',
    muscleGroups: ['Lower Abs'],
    target: ['Lower Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '12–15',
    defaultRest: 45,
    sets: 3,
    reps: '12–15',
    restSeconds: 45,
    instructions: [
      'Lie back with knees at 90 degrees.',
      'Curl hips off floor bringing knees toward chest.',
      'Lower hips slowly.'
    ],
    tips: ['Use lower abs, not momentum']
  },
  {
    id: 'leg-raise',
    name: 'Lying Leg Raise',
    category: 'Core',
    muscleGroups: ['Lower Abs', 'Hip Flexors'],
    target: ['Lower Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 45,
    sets: 3,
    reps: '10–12',
    restSeconds: 45,
    instructions: [
      'Lie flat, hands under glutes.',
      'Raise straight legs to vertical.',
      'Lower slowly without touching heels to floor.'
    ],
    tips: ['Keep lower back pressed flat into floor']
  },
  {
    id: 'lying-knee-raise',
    name: 'Lying Knee Raise',
    category: 'Core',
    muscleGroups: ['Lower Abs'],
    target: ['Lower Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45,
    sets: 3,
    reps: '15',
    restSeconds: 45,
    instructions: [
      'Lie on back, pull knees to chest.',
      'Extend legs out 45 degrees, then pull back.'
    ],
    tips: ['Easier variation of straight leg raise']
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'Core',
    muscleGroups: ['Deep Core Coordination'],
    target: ['Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '10 each side',
    defaultRest: 45,
    sets: 3,
    reps: '10 each side',
    restSeconds: 45,
    instructions: [
      'Lie on back, arms pointing to ceiling, knees at 90 degrees.',
      'Extend right arm back and left leg forward simultaneously.',
      'Return and repeat opposite side.'
    ],
    tips: ['Lower back must stay glued to ground']
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'Core',
    muscleGroups: ['Core', 'Lower Back Stability'],
    target: ['Core', 'Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '10 each side',
    defaultRest: 45,
    sets: 3,
    reps: '10 each side',
    restSeconds: 45,
    instructions: [
      'On hands and knees.',
      'Extend right arm forward and left leg straight back.',
      'Hold 1 sec, return, alternate.'
    ],
    tips: ['Keep hips parallel to floor']
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'Core',
    muscleGroups: ['Obliques'],
    target: ['Obliques'],
    equipment: 'Bodyweight (or 5 kg db)',
    difficulty: 'Intermediate',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '15 each side',
    defaultRest: 45,
    sets: 3,
    reps: '15 each side',
    restSeconds: 45,
    instructions: [
      'Seated V-sit position with feet slightly elevated.',
      'Rotate torso side to side touching hands/dumbbell to floor.'
    ],
    tips: ['Rotate shoulder axis, not just arms']
  },
  {
    id: 'heel-touches',
    name: 'Heel Touches',
    category: 'Core',
    muscleGroups: ['Obliques'],
    target: ['Obliques'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '15 each side',
    defaultRest: 45,
    sets: 3,
    reps: '15 each side',
    restSeconds: 45,
    instructions: [
      'Lie back, knees bent, feet flat.',
      'Crunch upper back up slightly, reach side to side touching heels.'
    ],
    tips: ['Target obliques side crunch']
  },
  {
    id: 'flutter-kicks',
    name: 'Flutter Kicks',
    category: 'Core',
    muscleGroups: ['Lower Abs'],
    target: ['Lower Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '30 seconds',
    defaultRest: 45,
    sets: 3,
    reps: '30 seconds',
    restSeconds: 45,
    instructions: [
      'Lie flat, lift legs 6 inches off ground.',
      'Kick legs up and down rapidly in scissor motion.'
    ],
    tips: ['Keep lower back flat']
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'Core',
    muscleGroups: ['Total Abs'],
    target: ['Total Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'Isometric',
    defaultSets: 3,
    defaultReps: '20–30 seconds',
    defaultRest: 60,
    sets: 3,
    reps: '20–30 seconds',
    restSeconds: 60,
    instructions: [
      'Lie flat, lift shoulders and straight legs 4 inches off floor.',
      'Arms extended back past ears forming banana shape curve.'
    ],
    tips: ['Ultimate gymnastics core hold']
  },
  {
    id: 'v-up',
    name: 'V-Up',
    category: 'Core',
    muscleGroups: ['Abs'],
    target: ['Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'Lie flat, simultaneously lift torso and legs to touch toes in V shape.',
      'Lower with control.'
    ],
    tips: ['Explosive contraction']
  },
  {
    id: 'side-plank-dip',
    name: 'Side Plank Hip Dip',
    category: 'Core',
    muscleGroups: ['Obliques'],
    target: ['Obliques'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '10 each side',
    defaultRest: 45,
    sets: 3,
    reps: '10 each side',
    restSeconds: 45,
    instructions: [
      'From side plank, lower lower hip toward floor.',
      'Drive hips high above baseline.'
    ],
    tips: ['Builds waist line definition']
  },
  {
    id: 'bear-crawl',
    name: 'Bear Crawl',
    category: 'Core',
    muscleGroups: ['Full Core', 'Shoulder Stability'],
    target: ['Full Core', 'Shoulder Stability'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Dynamic',
    defaultSets: 3,
    defaultReps: '30 seconds',
    defaultRest: 60,
    sets: 3,
    reps: '30 seconds',
    restSeconds: 60,
    instructions: [
      'Quadruped position with knees hovering 2 inches off floor.',
      'Crawl forward and back keeping knees hovering low.'
    ],
    tips: ['Total body core stabilization']
  },

  // --- FULL BODY & MOBILITY (10 Exercises) ---
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'Full Body',
    muscleGroups: ['Full Body', 'Cardio'],
    target: ['Full Body', 'Cardio'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 60,
    sets: 3,
    reps: '10–12',
    restSeconds: 60,
    instructions: [
      'From standing, drop into squat placing hands on floor.',
      'Jump feet back into push-up plank, perform push-up.',
      'Jump feet back to hands and explode up into jump.'
    ],
    tips: ['High calorie burn full-body exercise']
  },
  {
    id: 'db-clean-press',
    name: 'Dumbbell Clean & Press',
    category: 'Full Body',
    muscleGroups: ['Full Body', 'Power'],
    target: ['Full Body', 'Power'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Advanced',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–10',
    defaultRest: 90,
    sets: 3,
    reps: '8–10',
    restSeconds: 90,
    instructions: [
      'Hinge and clean dumbbells from floor to shoulders.',
      'Dip knees and press overhead explosive.'
    ],
    tips: ['Combines lower and upper body power']
  },
  {
    id: 'db-thruster',
    name: 'Dumbbell Thruster',
    category: 'Full Body',
    muscleGroups: ['Quads', 'Shoulders', 'Triceps'],
    target: ['Quads', 'Shoulders'],
    equipment: '5 kg × 2 dumbbells',
    difficulty: 'Intermediate',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '10–12',
    defaultRest: 90,
    sets: 3,
    reps: '10–12',
    restSeconds: 90,
    instructions: [
      'Hold dumbbells at shoulders, squat deep.',
      'Drive up out of squat and press dumbbells overhead in one fluid motion.'
    ],
    tips: ['Use momentum from legs to drive press']
  },
  {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch",
    category: 'Mobility',
    muscleGroups: ['Hips', 'Thoracic Spine', 'Hamstrings'],
    target: ['Hips', 'Thoracic Spine'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '5 each side',
    defaultRest: 30,
    sets: 2,
    reps: '5 each side',
    restSeconds: 30,
    instructions: [
      'Lunge forward placing inside hand on floor next to front foot.',
      'Rotate opposite arm to ceiling opening chest.',
      'Rotate back and reach elbow to floor.'
    ],
    tips: ['Premier mobility warm-up']
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'Mobility',
    muscleGroups: ['Spine Mobility'],
    target: ['Spine Mobility'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '10 reps',
    defaultRest: 30,
    sets: 2,
    reps: '10 reps',
    restSeconds: 30,
    instructions: [
      'On hands and knees, arch spine up (cat), then dip spine down while lifting head (cow).'
    ],
    tips: ['Move gently with breath']
  },
  {
    id: 'hip-opener',
    name: '90/90 Hip Opener',
    category: 'Mobility',
    muscleGroups: ['Hip Rotators'],
    target: ['Hip Rotators'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '8 switches',
    defaultRest: 30,
    sets: 2,
    reps: '8 switches',
    restSeconds: 30,
    instructions: [
      'Seated with front and back leg bent at 90 degrees.',
      'Rotate hips switching leg positions side to side.'
    ],
    tips: ['Improves internal and external hip rotation']
  },
  {
    id: 'thoracic-rotation',
    name: 'Thoracic Spine Rotation',
    category: 'Mobility',
    muscleGroups: ['Thoracic Spine'],
    target: ['Thoracic Spine'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '10 each side',
    defaultRest: 30,
    sets: 2,
    reps: '10 each side',
    restSeconds: 30,
    instructions: [
      'On knees, place hand behind head, rotate elbow up toward ceiling opening chest.'
    ],
    tips: ['Relieves upper back stiffness from sitting']
  },
  {
    id: 'ankle-mobility',
    name: 'Knee-to-Wall Ankle Mobility',
    category: 'Mobility',
    muscleGroups: ['Ankle Dorsiflexion'],
    target: ['Ankle Dorsiflexion'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '10 each foot',
    defaultRest: 30,
    sets: 2,
    reps: '10 each foot',
    restSeconds: 30,
    instructions: [
      'Facing wall, drive knee forward past toes toward wall while keeping heel flat.'
    ],
    tips: ['Improves squat depth']
  },
  {
    id: 'arm-circles',
    name: 'Dynamic Arm Circles',
    category: 'Mobility',
    muscleGroups: ['Shoulder Warm-up'],
    target: ['Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Mobility',
    defaultSets: 2,
    defaultReps: '15 forward / 15 back',
    defaultRest: 30,
    sets: 2,
    reps: '15 forward / 15 back',
    restSeconds: 30,
    instructions: [
      'Arms extended wide, rotate in small to large circles forward then backward.'
    ],
    tips: ['Warms up shoulder joint capsule']
  },
  {
    id: 'inchworm',
    name: 'Inchworm',
    category: 'Full Body',
    muscleGroups: ['Hamstrings', 'Core', 'Shoulders'],
    target: ['Hamstrings', 'Core', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Compound',
    defaultSets: 3,
    defaultReps: '8–10',
    defaultRest: 45,
    sets: 3,
    reps: '8–10',
    restSeconds: 45,
    instructions: [
      'Stand tall, hinge forward touching floor, walk hands out to plank.',
      'Walk feet back up to hands keeping legs straight.'
    ],
    tips: ['Stretches hamstrings while warming up shoulders and core']
  },
];

export function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id) || null;
}

export function getExercisesByCategory(category) {
  if (!category || category === 'All') return EXERCISES;
  return EXERCISES.filter(e => e.category?.toLowerCase() === category.toLowerCase() || e.target?.some(t => t.toLowerCase().includes(category.toLowerCase())));
}

export function searchExercises(query, categoryFilter = 'All', equipmentFilter = 'All', difficultyFilter = 'All') {
  return EXERCISES.filter(e => {
    const q = query.toLowerCase();
    const matchesQuery = !query || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.target.some(t => t.toLowerCase().includes(q)) || e.equipment.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || e.category.toLowerCase() === categoryFilter.toLowerCase() || e.target.some(t => t.toLowerCase().includes(categoryFilter.toLowerCase()));
    const matchesEquipment = equipmentFilter === 'All' || e.equipment.toLowerCase().includes(equipmentFilter.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || e.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesQuery && matchesCategory && matchesEquipment && matchesDifficulty;
  });
}
