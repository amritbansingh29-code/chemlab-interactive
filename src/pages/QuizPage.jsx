import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, RotateCcw, AlertTriangle, ArrowRight, Award as Trophy, Zap, Clock, HelpCircle, CheckCircle, XCircle } from 'lucide-react'

// ============================================================
// 🧪 THE COMPLETE 50 CHEMISTRY QUESTIONS DATABASE
// ============================================================
const chemistryQuestions = [
  {
    id: 1,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the most abundant element in the universe?",
    options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
    answerIndex: 1,
    explanation: "Hydrogen (H) is the simplest and most abundant chemical substance in the universe, making up approximately 75% of all baryonic (visible) mass."
  },
  {
    id: 2,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "What is the chemical symbol for Gold?",
    options: ["Gd", "Ag", "Au", "Go"],
    answerIndex: 2,
    explanation: "The chemical symbol for gold is 'Au', derived from the Latin word 'aurum', which translates to 'shining dawn'."
  },
  {
    id: 3,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Oxygen"],
    answerIndex: 1,
    explanation: "Hydrogen has exactly one proton in its nucleus, giving it the atomic number 1. It is the first element in the periodic table."
  },
  {
    id: 4,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "Which non-metal is a liquid at room temperature?",
    options: ["Bromine", "Mercury", "Chlorine", "Iodine"],
    answerIndex: 0,
    explanation: "Bromine (Br) is the only nonmetallic element that is a liquid under standard temperature and pressure conditions, exhibiting a dark reddish-brown color."
  },
  {
    id: 5,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "Which metallic element is liquid at room temperature?",
    options: ["Gallium", "Mercury", "Cesium", "Sodium"],
    answerIndex: 1,
    explanation: "Mercury (Hg), traditionally called quicksilver, is the only metallic element that remains liquid at standard room temperature and pressure."
  },
  {
    id: 6,
    category: "Atomic Structure",
    difficulty: "Easy",
    question: "What is the electrical charge of a neutron?",
    options: ["Positive (+1)", "Negative (-1)", "Neutral (0)", "Variable"],
    answerIndex: 2,
    explanation: "Neutrons are subatomic particles located in the atomic nucleus that carry no electrical charge (they are electrically neutral)."
  },
  {
    id: 7,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "What is the common group name for elements in Group 18 of the periodic table?",
    options: ["Alkali Metals", "Halogens", "Noble Gases", "Lanthanides"],
    answerIndex: 2,
    explanation: "Group 18 elements are called Noble Gases. They possess completely filled outer valence electron shells, making them highly stable and chemically inert."
  },
  {
    id: 8,
    category: "Acids & Bases",
    difficulty: "Medium",
    question: "Which acid is primary constituent of car batteries?",
    options: ["Hydrochloric Acid", "Nitric Acid", "Sulfuric Acid", "Phosphoric Acid"],
    answerIndex: 2,
    explanation: "Lead-acid car batteries use Sulfuric Acid (H₂SO₄) diluted with water as the electrolyte to conduct electricity during chemical discharge cycles."
  },
  {
    id: 9,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "Which gas constitutes approximately 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    answerIndex: 2,
    explanation: "Nitrogen gas (N₂) is the most abundant gas in Earth's atmosphere, accounting for roughly 78.08%, while Oxygen makes up about 20.95%."
  },
  {
    id: 10,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the common name for solid Carbon Dioxide?",
    options: ["Dry Ice", "Liquid Nitrogen", "Slush Ice", "Quartz"],
    answerIndex: 0,
    explanation: "Solid carbon dioxide is called 'Dry Ice' because it undergoes sublimation—converting directly from a solid to a gas without melting into liquid."
  },
  {
    id: 11,
    category: "Atomic Structure",
    difficulty: "Medium",
    question: "Which subatomic particle was discovered by J.J. Thomson in 1897 using cathode ray tubes?",
    options: ["Proton", "Neutron", "Electron", "Quark"],
    answerIndex: 2,
    explanation: "J.J. Thomson discovered the electron, showing that atoms contain small, negatively charged fundamental particles, which disproved the indivisible atom theory."
  },
  {
    id: 12,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the chemical formula for common table salt?",
    options: ["NaCO₃", "HCl", "NaCl", "NaOH"],
    answerIndex: 2,
    explanation: "Table salt is Sodium Chloride, represented by the chemical formula NaCl. It is an ionic lattice comprised of equal parts sodium and chlorine ions."
  },
  {
    id: 13,
    category: "Acids & Bases",
    difficulty: "Easy",
    question: "What is the pH of chemically pure water at standard room temperature?",
    options: ["1", "5", "7", "14"],
    answerIndex: 2,
    explanation: "Pure water is neutral on the pH scale, having a pH of exactly 7.0 at 25°C because the concentration of hydronium and hydroxide ions is perfectly balanced."
  },
  {
    id: 14,
    category: "Chemical Reactions",
    difficulty: "Easy",
    question: "What substance increases the rate of a chemical reaction without being consumed in the process?",
    options: ["Reactant", "Solvent", "Catalyst", "Inhibitor"],
    answerIndex: 2,
    explanation: "A catalyst speeds up a reaction by providing an alternative reaction pathway with a lower activation energy, remaining completely unchanged at the end."
  },
  {
    id: 15,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "Which is the lightest and most highly reactive halogen element?",
    options: ["Chlorine", "Fluorine", "Bromine", "Astatine"],
    answerIndex: 1,
    explanation: "Fluorine (F) is the first element in Group 17 (Halogens). It is a pale yellow gas and is the most chemically reactive and electronegative element in existence."
  },
  {
    id: 16,
    category: "Chemical Bonding",
    difficulty: "Easy",
    question: "What type of chemical bond is formed when two atoms share a pair of electrons?",
    options: ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
    answerIndex: 1,
    explanation: "A covalent bond consists of the mutual sharing of one or more pairs of electrons between two non-metallic atoms to achieve stable noble gas configurations."
  },
  {
    id: 17,
    category: "Chemical Bonding",
    difficulty: "Easy",
    question: "What type of bond is formed by the electrostatic attraction between oppositely charged ions?",
    options: ["Covalent Bond", "Ionic Bond", "Coordinate Bond", "Metallic Bond"],
    answerIndex: 1,
    explanation: "An ionic bond forms when one or more electrons are completely transferred from a metal atom (forming a cation) to a non-metal atom (forming an anion)."
  },
  {
    id: 18,
    category: "Atomic Structure",
    difficulty: "Easy",
    question: "How many valence electrons does a neutral Carbon atom possess?",
    options: ["2", "4", "6", "8"],
    answerIndex: 1,
    explanation: "Carbon has the atomic number 6, with an electron configuration of 1s² 2s² 2p². The outer shell (n=2) contains 4 valence electrons, allowing it to form 4 covalent bonds."
  },
  {
    id: 19,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "What is the chemical formula of Ozone?",
    options: ["O₂", "O₃", "CO₂", "H₂O"],
    answerIndex: 1,
    explanation: "Ozone is a triatomic allotrope of oxygen, consisting of three oxygen atoms bonded together, represented chemically as O₃."
  },
  {
    id: 20,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "Which synthetic element was named to honor the legendary physicist Albert Einstein?",
    options: ["Fermium", "Nobelium", "Einsteinium", "Mendelevium"],
    answerIndex: 2,
    explanation: "Einsteinium (Es, atomic number 99) is a highly radioactive transuranic synthetic element discovered in the debris of the first thermonuclear bomb explosion in 1952."
  },
  {
    id: 21,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the primary gaseous component of natural gas?",
    options: ["Ethane", "Propane", "Methane", "Butane"],
    answerIndex: 2,
    explanation: "Methane (CH₄), a simple single-carbon alkane, makes up approximately 70% to 90% of the hydrocarbon mixture found in natural gas."
  },
  {
    id: 22,
    category: "Acids & Bases",
    difficulty: "Medium",
    question: "Which of the following pH values indicates a highly acidic solution?",
    options: ["pH 1", "pH 6", "pH 8", "pH 13"],
    answerIndex: 0,
    explanation: "The pH scale ranges from 0 to 14. Lower numbers represent higher acidity. A pH of 1 is highly acidic, whereas a pH of 13 represents a strong base."
  },
  {
    id: 23,
    category: "Chemical Reactions",
    difficulty: "Medium",
    question: "Which gas is released when a reactive metal like Zinc reacts with Hydrochloric Acid?",
    options: ["Oxygen", "Chlorine", "Hydrogen", "Carbon Dioxide"],
    answerIndex: 2,
    explanation: "This single displacement reaction (Zn + 2HCl → ZnCl₂ + H₂) yields zinc chloride salt and releases highly flammable Hydrogen gas (H₂)."
  },
  {
    id: 24,
    category: "Lab Safety",
    difficulty: "Easy",
    question: "If a corrosive chemical splashes into your eyes, how long should you rinse them at the eyewash station?",
    options: ["1-2 minutes", "At least 15 minutes", "5 minutes", "Rinsing is not recommended"],
    answerIndex: 1,
    explanation: "Safety protocols dictate flushing eyes with clean, running water at an eyewash station for at least 15-20 minutes to thoroughly dilute and clear out corrosive chemicals."
  },
  {
    id: 25,
    category: "Chemical Reactions",
    difficulty: "Medium",
    question: "In a flame test, what color indicates the presence of Copper ions (Cu²⁺)?",
    options: ["Bright Crimson Red", "Greenish-Blue", "Lilac/Violet", "Golden Yellow"],
    answerIndex: 1,
    explanation: "Copper ions impart a distinctive bright greenish-blue hue to a burner flame due to electron excitation and subsequent photon emissions at specific wavelengths."
  },
  {
    id: 26,
    category: "Stoichiometry",
    difficulty: "Medium",
    question: "What is the standard SI unit for measuring the amount of a chemical substance?",
    options: ["Gram", "Mole", "Liter", "Pascal"],
    answerIndex: 1,
    explanation: "The Mole (mol) is the SI base unit representing the quantity of a substance containing exactly 6.02214076 × 10²³ elementary entities (Avogadro's number)."
  },
  {
    id: 27,
    category: "Stoichiometry",
    difficulty: "Medium",
    question: "What is the approximate numerical value of Avogadro's constant?",
    options: ["3.00 × 10⁸", "6.02 × 10²³", "1.60 × 10⁻¹⁹", "9.81"],
    answerIndex: 1,
    explanation: "Avogadro's constant is 6.022 × 10²³ molecules, atoms, or particles per mole, representing the ratio of particles to the amount of substance."
  },
  {
    id: 28,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "Which metallic element is represented by the chemical symbol 'K'?",
    options: ["Krypton", "Potassium", "Cobalt", "Calcium"],
    answerIndex: 1,
    explanation: "Potassium is represented by the letter 'K', derived from its Neo-Latin name 'Kalium', which refers to alkali substances extracted from plant ashes."
  },
  {
    id: 29,
    category: "Atomic Structure",
    difficulty: "Easy",
    question: "Which subatomic particles reside inside the central nucleus of an atom?",
    options: ["Protons and Electrons", "Electrons and Neutrons", "Protons and Neutrons", "Only Protons"],
    answerIndex: 2,
    explanation: "The dense atomic nucleus houses nucleons, which consist of positively charged Protons and uncharged Neutrons, while electrons orbit in shells surrounding it."
  },
  {
    id: 30,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "What is the term for a substance converting directly from the solid phase to the gas phase?",
    options: ["Evaporation", "Condensation", "Sublimation", "Deposition"],
    answerIndex: 2,
    explanation: "Sublimation is the endothermic phase transition of a substance directly from solid to gas, bypassing the intermediate liquid state (e.g., dry ice, iodine)."
  },
  {
    id: 31,
    category: "Periodic Table",
    difficulty: "Hard",
    question: "Which chemical element possesses the absolute highest electronegativity value on the Pauling scale?",
    options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"],
    answerIndex: 2,
    explanation: "Fluorine has the highest electronegativity of all elements, valued at 3.98 on the Pauling scale, indicating an extreme tendency to attract bonding electrons."
  },
  {
    id: 32,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "What is the primary chemical compound found in ordinary silica glass?",
    options: ["Sodium Carbonate", "Silicon Dioxide", "Calcium Silicate", "Aluminium Oxide"],
    answerIndex: 1,
    explanation: "Ordinary glass is made by melting sand, which is primarily composed of Silicon Dioxide (SiO₂), also known as silica."
  },
  {
    id: 33,
    category: "Chemical Reactions",
    difficulty: "Easy",
    question: "Which colorless gas burns in air with a characteristic loud squeaky 'pop' sound during a laboratory splint test?",
    options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Helium"],
    answerIndex: 1,
    explanation: "Hydrogen gas is highly flammable. When a glowing splint is inserted into a tube containing hydrogen mixed with oxygen, it ignites rapidly, producing a distinct 'pop'."
  },
  {
    id: 34,
    category: "Chemical Reactions",
    difficulty: "Easy",
    question: "What term describes a chemical reaction that releases thermal energy (heat) into its surroundings?",
    options: ["Endothermic", "Exothermic", "Isothermal", "Catalytic"],
    answerIndex: 1,
    explanation: "An exothermic reaction releases energy (usually heat or light) to the surroundings because the energy released during bond formation exceeds the energy needed for bond breaking."
  },
  {
    id: 35,
    category: "Acids & Bases",
    difficulty: "Easy",
    question: "Which weak organic acid gives household vinegar its characteristic sour taste and sharp odor?",
    options: ["Citric Acid", "Formic Acid", "Acetic Acid", "Lactic Acid"],
    answerIndex: 2,
    explanation: "Vinegar is an aqueous solution containing approximately 5-8% Acetic Acid (CH₃COOH), a simple carboxylic acid produced by bacterial fermentation of ethanol."
  },
  {
    id: 36,
    category: "Acids & Bases",
    difficulty: "Easy",
    question: "Which strong base is commonly known as caustic soda and used extensively in soap manufacturing?",
    options: ["Calcium Hydroxide", "Sodium Hydroxide", "Ammonium Hydroxide", "Potassium Carbonate"],
    answerIndex: 1,
    explanation: "Sodium Hydroxide (NaOH) is a highly corrosive alkali known as caustic soda or lye. It reacts with fats and oils in a process called saponification to produce soap."
  },
  {
    id: 37,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "What is the chemical symbol for the heavy metal element Lead?",
    options: ["Le", "Ld", "Pb", "Li"],
    answerIndex: 2,
    explanation: "The chemical symbol for lead is 'Pb', representing the Latin word 'plumbum', which is also the root for modern words like 'plumbing'."
  },
  {
    id: 38,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "Which crystalline allotrope of Carbon conducts electricity despite being a non-metal?",
    options: ["Diamond", "Graphite", "Buckminsterfullerene", "Amorphous Carbon"],
    answerIndex: 1,
    explanation: "Graphite has a layered structure where carbon atoms are sp² hybridized. This leaves one delocalized electron per carbon atom free to drift, conducting electricity."
  },
  {
    id: 39,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "Which Russian chemist is widely credited with publishing the first recognizable Periodic Table of Elements in 1869?",
    options: ["Antoine Lavoisier", "Dmitri Mendeleev", "John Dalton", "Marie Curie"],
    answerIndex: 1,
    explanation: "Dmitri Mendeleev formulated the Periodic Law and created the first periodic table, organizing elements by atomic mass and leaving gaps to accurately predict undiscovered elements."
  },
  {
    id: 40,
    category: "Acids & Bases",
    difficulty: "Easy",
    question: "What happens when blue litmus indicator paper is dipped into an acidic solution?",
    options: ["It remains blue", "It turns bright red", "It turns green", "It turns completely black"],
    answerIndex: 1,
    explanation: "Litmus is a water-soluble dye extracted from lichens. Under acidic conditions (pH < 4.5), the indicator molecules undergo protonation, shifting their color to red."
  },
  {
    id: 41,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What element is the primary material used in modern pencil leads?",
    options: ["Lead", "Graphite (Carbon)", "Silicon", "Charcoal"],
    answerIndex: 1,
    explanation: "Pencil leads do not contain lead. They are made from a blended mixture of Graphite (a soft allotrope of carbon) and clay, which leaves a dark gray residue on paper."
  },
  {
    id: 42,
    category: "Chemical Reactions",
    difficulty: "Medium",
    question: "Which gas turns clear limewater [aqueous Calcium Hydroxide] milky/cloudy upon bubbling through it?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Carbon Monoxide"],
    answerIndex: 2,
    explanation: "Carbon dioxide reacts with limewater to form insoluble Calcium Carbonate (CaCO₃) precipitate particles, creating a milky white suspension: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O."
  },
  {
    id: 43,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "What is the typical physical color of Chlorine gas under standard conditions?",
    options: ["Colorless", "Deep Blue", "Pale Yellow-Green", "Dark Violet"],
    answerIndex: 2,
    explanation: "Chlorine gas (Cl₂) is a diatomic gas characterized by a distinctive, suffocating odor and a pale, yellowish-green color."
  },
  {
    id: 44,
    category: "General Chemistry",
    difficulty: "Medium",
    question: "Brass is a classic metallic alloy comprised primarily of which two elements?",
    options: ["Copper and Tin", "Iron and Carbon", "Copper and Zinc", "Silver and Gold"],
    answerIndex: 2,
    explanation: "Brass is an alloy consisting of Copper (Cu) fused with Zinc (Zn), whereas Bronze is typically an alloy of Copper blended with Tin (Sn)."
  },
  {
    id: 45,
    category: "Lab Safety",
    difficulty: "Medium",
    question: "When diluting a highly concentrated acid in a laboratory, what is the correct and safe method for mixing?",
    options: ["Pour water quickly into the acid", "Pour acid slowly into water", "Pour both simultaneously", "Mix in a sealed vacuum container"],
    answerIndex: 1,
    explanation: "Always add acid slowly to water (remember 'A&W'). Diluting concentrated acid is highly exothermic. Adding water to acid can cause the mixture to flash boil and violently splash corrosive acid out."
  },
  {
    id: 46,
    category: "Acids & Bases",
    difficulty: "Easy",
    question: "What color change occurs when red litmus paper is exposed to an alkaline (basic) solution?",
    options: ["It turns white", "It turns green", "It turns dark blue", "It remains red"],
    answerIndex: 2,
    explanation: "Basic or alkaline substances (pH > 8.3) deprotonate the litmus dye structure, causing it to return to its conjugate base form, which appears deep blue."
  },
  {
    id: 47,
    category: "Atomic Structure",
    difficulty: "Hard",
    question: "What is the net electrical charge of an alpha particle?",
    options: ["-1", "0", "+1", "+2"],
    answerIndex: 3,
    explanation: "An alpha particle (α) is identical to a Helium-4 nucleus, containing 2 protons and 2 neutrons with no orbiting electrons, resulting in a net positive charge of +2."
  },
  {
    id: 48,
    category: "Chemical Bonding",
    difficulty: "Hard",
    question: "Which of the following compounds exhibits a giant covalent network structure, giving it an extremely high melting point?",
    options: ["Water (H₂O)", "Silicon Dioxide (SiO₂)", "Sodium Chloride (NaCl)", "Carbon Dioxide (CO₂)"],
    answerIndex: 1,
    explanation: "Silicon Dioxide (Quartz) forms a giant three-dimensional covalent lattice similar to diamond, where every silicon atom is covalently bonded to four oxygen atoms."
  },
  {
    id: 49,
    category: "Chemical Reactions",
    difficulty: "Medium",
    question: "What metal catalyst is traditionally employed in the industrial Haber-Bosch process to synthesize ammonia?",
    options: ["Platinum", "Nickel", "Iron", "Copper"],
    answerIndex: 2,
    explanation: "The industrial synthesis of Ammonia (N₂ + 3H₂ ⇌ 2NH₃) utilizes a finely divided porous Iron catalyst promoted with potassium and aluminum oxides to run at moderate temperatures."
  },
  {
    id: 50,
    category: "Periodic Table",
    difficulty: "Hard",
    question: "Which of the following halogens has the largest atomic radius and lowest reactivity?",
    options: ["Fluorine", "Chlorine", "Bromine", "Iodine"],
    answerIndex: 3,
    explanation: "Reactivity in Group 17 (Halogens) decreases down the group. Iodine (I) is lower down than F, Cl, and Br, meaning its valence electrons are further from the nucleus and it attracts electrons less strongly."
  },
  {
    id: 51,
    category: "Organic Chemistry",
    difficulty: "Hard",
    question: "Which of the following describes the stereochemical outcome of an SN2 reaction on a chiral carbon?",
    options: ["Complete racemization", "Walden inversion of configuration", "Retention of configuration", "Formation of a meso compound"],
    answerIndex: 1,
    explanation: "An SN2 reaction proceeds via backside attack of the nucleophile on the electrophilic carbon. As the transition state resolves, this concerted mechanism causes a complete inversion of configuration, known as Walden inversion."
  },
  {
    id: 52,
    category: "Atomic Structure",
    difficulty: "Medium",
    question: "What is the maximum number of electrons that can occupy the 3d subshell?",
    options: ["2", "6", "10", "14"],
    answerIndex: 2,
    explanation: "The 'd' subshell has angular momentum quantum number l = 2, which allows 5 orbitals (ml = -2, -1, 0, +1, +2). Each orbital holds up to 2 electrons, allowing a maximum of 10 electrons in the 3d subshell."
  },
  {
    id: 53,
    category: "Acids & Bases",
    difficulty: "Medium",
    question: "According to the Lewis definition, what constitutes a base?",
    options: ["A proton donor", "A proton acceptor", "An electron pair donor", "An electron pair acceptor"],
    answerIndex: 2,
    explanation: "A Lewis base is any species that can donate a pair of electrons to form a covalent bond. A Lewis acid, conversely, is an electron-pair acceptor."
  },
  {
    id: 54,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the main component of natural gas?",
    options: ["Ethane", "Propane", "Butane", "Methane"],
    answerIndex: 3,
    explanation: "Methane (CH₄) is the simplest alkane hydrocarbon and is the primary constituent of natural gas, typically making up between 70% to 90% of its volume."
  },
  {
    id: 55,
    category: "Periodic Table",
    difficulty: "Hard",
    question: "Which of the following elements has the highest first ionization energy?",
    options: ["Oxygen", "Fluorine", "Nitrogen", "Neon"],
    answerIndex: 3,
    explanation: "Neon (Ne) is a noble gas with a completely filled valence electron shell (2s²2p⁶). Because of this highly stable closed-shell configuration and relatively high effective nuclear charge, it is extremely difficult to remove an electron, giving it the highest first ionization energy among the options."
  },
  {
    id: 56,
    category: "Chemical Bonding",
    difficulty: "Medium",
    question: "What is the hybridization of the carbon atom in carbon dioxide (CO₂)?",
    options: ["sp", "sp2", "sp3", "sp3d"],
    answerIndex: 0,
    explanation: "In carbon dioxide (O=C=O), the carbon atom forms two double bonds (two sigma bonds and two pi bonds) and has zero lone pairs. This yields a steric number of 2, requiring sp hybridization and resulting in a linear molecular shape."
  },
  {
    id: 57,
    category: "Gases & Solutions",
    difficulty: "Hard",
    question: "Which gas will effuse the fastest under identical conditions of temperature and pressure?",
    options: ["Oxygen (O₂)", "Nitrogen (N₂)", "Helium (He)", "Carbon Dioxide (CO₂)"],
    answerIndex: 2,
    explanation: "According to Graham's Law of Effusion, the rate of effusion of a gas is inversely proportional to the square root of its molar mass. Helium (He) has the lowest molar mass (4 g/mol) among the options, meaning it will effuse the fastest."
  },
  {
    id: 58,
    category: "Lab Safety",
    difficulty: "Easy",
    question: "What is the first step you should take if a chemical splashes into your eyes in the lab?",
    options: ["Wipe your eyes with a paper towel", "Flush your eyes immediately with water for 15-20 minutes", "Apply eye drops to soothe irritation", "Find the lab instructor to ask what to do"],
    answerIndex: 1,
    explanation: "If any chemical splashes into the eyes, you must immediately flush them with copious amounts of running water using the eyewash station for at least 15 to 20 minutes to dilute and remove the chemical before seeking medical attention."
  },
  {
    id: 59,
    category: "Chemical Reactions",
    difficulty: "Medium",
    question: "In the single displacement reaction Zn + 2HCl -> ZnCl₂ + H₂, which species is being oxidized?",
    options: ["Zinc (Zn)", "Hydrogen ion (H+)", "Chloride ion (Cl-)", "Zinc ion (Zn2+)"],
    answerIndex: 0,
    explanation: "Zinc (Zn) starts in its elemental form with an oxidation state of 0 and ends in ZnCl₂ with an oxidation state of +2. Losing electrons represents oxidation (OIL), so elemental Zinc is oxidized."
  },
  {
    id: 60,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the standard value of atmospheric pressure at sea level in millimeters of mercury (mmHg)?",
    options: ["100 mmHg", "760 mmHg", "1000 mmHg", "14.7 mmHg"],
    answerIndex: 1,
    explanation: "Standard atmospheric pressure (1 atm) is defined as exactly 760 mmHg (torr) at sea level, which represents the height of a mercury column supported by atmospheric pressure."
  },
  {
    id: 61,
    category: "Atomic Structure",
    difficulty: "Medium",
    question: "Which quantum number determines the orientation of an orbital in space?",
    options: ["Principal quantum number (n)", "Angular momentum quantum number (l)", "Magnetic quantum number (ml)", "Spin quantum number (ms)"],
    answerIndex: 2,
    explanation: "The magnetic quantum number (ml) specifies the orientation of the orbital in space. Its values are integers ranging from -l to +l, defining the number of degenerate orbitals in a subshell."
  },
  {
    id: 62,
    category: "Periodic Table",
    difficulty: "Easy",
    question: "What is the common group name of Group 17 elements in the periodic table?",
    options: ["Alkali Metals", "Alkaline Earth Metals", "Halogens", "Noble Gases"],
    answerIndex: 2,
    explanation: "Group 17 elements are known as the Halogens. They are highly reactive nonmetals that form salts when reacted with metals (from the Greek roots 'halo-' meaning salt and '-gen' meaning producing)."
  },
  {
    id: 63,
    category: "Chemical Bonding",
    difficulty: "Medium",
    question: "What type of intermolecular force is primarily responsible for the high boiling point of water?",
    options: ["London dispersion forces", "Dipole-dipole interactions", "Hydrogen bonding", "Ionic bonding"],
    answerIndex: 2,
    explanation: "Hydrogen bonding, a strong type of dipole-dipole attraction that occurs between Hydrogen bonded to highly electronegative elements (N, O, F) and a neighboring electronegative atom's lone pair, holds water molecules together tightly, resulting in an anomalously high boiling point of 100°C."
  },
  {
    id: 64,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "Which of the following processes is a physical change rather than a chemical reaction?",
    options: ["Baking a cake", "Burning paper", "Melting an ice cube", "Rusting of an iron nail"],
    answerIndex: 2,
    explanation: "Melting an ice cube is a physical change because it is only a phase change from solid water to liquid water. The chemical identity of the water molecules (H₂O) remains unchanged."
  },
  {
    id: 65,
    category: "Acids & Bases",
    difficulty: "Hard",
    question: "What is the pH of a 1.0 x 10^-3 M aqueous solution of a strong acid like HCl?",
    options: ["3.0", "7.0", "11.0", "1.0"],
    answerIndex: 0,
    explanation: "HCl is a strong acid that dissociates completely in water. Thus, [H+] = 1.0 x 10^-3 M. pH is calculated as -log[H+], which equals -log(10^-3) = 3.0."
  },
  {
    id: 66,
    category: "Chemical Reactions",
    difficulty: "Hard",
    question: "Which of the following chemical equations represents a classic double displacement reaction?",
    options: ["2H₂ + O₂ -> 2H₂O", "AgNO₃ + NaCl -> AgCl + NaNO₃", "CaCO₃ -> CaO + CO₂", "Zn + CuSO₄ -> ZnSO₄ + Cu"],
    answerIndex: 1,
    explanation: "AgNO₃ (aq) + NaCl (aq) -> AgCl (s) + NaNO₃ (aq) is a double displacement reaction. The cations and anions exchange partners, and silver chloride precipitates out as an insoluble solid."
  },
  {
    id: 67,
    category: "Lab Safety",
    difficulty: "Easy",
    question: "When using a fire extinguisher, what does the safety acronym PASS stand for?",
    options: ["Pull, Aim, Squeeze, Sweep", "Push, Activate, Spray, Sweep", "Pull, Arm, Spray, Squeeze", "Press, Aim, Squeeze, Shake"],
    answerIndex: 0,
    explanation: "PASS is the standard sequence for operating a fire extinguisher: Pull the pin, Aim the nozzle at the base of the fire, Squeeze the trigger, and Sweep side-to-side."
  },
  {
    id: 68,
    category: "Gases & Solutions",
    difficulty: "Medium",
    question: "What defines a solution that contains the maximum concentration of dissolved solute at a specific temperature?",
    options: ["Unsaturated", "Saturated", "Supersaturated", "Concentrated"],
    answerIndex: 1,
    explanation: "A saturated solution is one in which the dynamic rate of dissolution equals the rate of crystallization, meaning it holds the absolute maximum amount of dissolved solute possible under standard equilibrium at that temperature."
  },
  {
    id: 69,
    category: "Organic Chemistry",
    difficulty: "Hard",
    question: "Which of the following cyclic compounds is classified as an aromatic hydrocarbon, satisfying Hückel's Rule?",
    options: ["Cyclohexane", "Benzene", "Hexane", "Acetylene"],
    answerIndex: 1,
    explanation: "Benzene (C₆H₆) is the quintessential aromatic hydrocarbon. It is cyclic, planar, fully conjugated, and has 6 pi electrons, which perfectly matches Hückel's (4n+2) rule for n=1."
  },
  {
    id: 70,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "Which element has the highest electronegativity value in the periodic table?",
    options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
    answerIndex: 1,
    explanation: "Fluorine (F) is the most electronegative element in the periodic table, with a value of 4.0 on the Pauling scale, due to its small size and high effective nuclear charge which strongly attracts shared bonding electrons."
  },
  {
    id: 71,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the official SI unit for measuring the amount of substance in chemistry?",
    options: ["Gram", "Liter", "Mole", "Pascal"],
    answerIndex: 2,
    explanation: "The mole (mol) is the SI base unit representing the amount of substance. One mole contains exactly 6.02214076 x 10^23 elementary entities."
  },
  {
    id: 72,
    category: "Atomic Structure",
    difficulty: "Medium",
    question: "What subatomic particles are located within the dense nucleus of a typical atom?",
    options: ["Protons and Electrons", "Electrons and Neutrons", "Protons and Neutrons", "Only Protons"],
    answerIndex: 2,
    explanation: "The nucleus of an atom contains protons (positively charged) and neutrons (electrically neutral). Electrons orbit around this central nucleus in energy shells."
  },
  {
    id: 73,
    category: "Chemical Bonding",
    difficulty: "Hard",
    question: "Which of the following molecules has a linear molecular geometry?",
    options: ["Water (H₂O)", "Sulfur Dioxide (SO₂)", "Carbon Dioxide (CO₂)", "Ammonia (NH₃)"],
    answerIndex: 2,
    explanation: "Carbon dioxide (CO₂) is linear (180° bond angle) because the central Carbon has two double bonds and no lone pairs, meaning its valence electron pairs repel each other to opposite sides."
  },
  {
    id: 74,
    category: "Acids & Bases",
    difficulty: "Medium",
    question: "Which pH value represents a strongly basic (alkaline) aqueous solution?",
    options: ["1.0", "5.0", "7.0", "13.0"],
    answerIndex: 3,
    explanation: "The pH scale ranges from 0 to 14. A pH of 7.0 is neutral, values below 7 are acidic, and values above 7 are basic. A pH of 13.0 represents an extremely high concentration of hydroxide ions, making it strongly basic."
  },
  {
    id: 75,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "Which state of matter possesses a definite volume but adapts to assume the shape of its container?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    answerIndex: 1,
    explanation: "Liquids have a definite volume because their constituent molecules are in close contact, but they can flow and take the shape of their container because the molecules can slide past one another."
  },
  {
    id: 76,
    category: "Lab Safety",
    difficulty: "Medium",
    question: "Which piece of laboratory equipment should be utilized to measure and dispense exact small volumes of liquid reactants?",
    options: ["A graduated cylinder", "A pipette or dropper", "A beaker", "Pouring directly from the stock bottle"],
    answerIndex: 1,
    explanation: "A pipette (graduated or volumetric) or micro-pipette is designed to measure and transfer highly accurate small volumes of liquids, whereas beakers and flasks are only for holding and mixing reagents."
  },
  {
    id: 77,
    category: "Chemical Reactions",
    difficulty: "Hard",
    question: "According to Le Chatelier's Principle, how does increasing the external pressure affect the equilibrium of: N₂(g) + 3H₂(g) ⇌ 2NH₃(g)?",
    options: ["Shift equilibrium to the left", "Shift equilibrium to the right", "No effect on the equilibrium", "The reaction will stop"],
    answerIndex: 1,
    explanation: "Increasing pressure shifts equilibrium toward the side with fewer gas moles. Here, the reactants side has 4 moles (1 N₂ + 3 H₂) and the products side has 2 moles (2 NH₃). Thus, the equilibrium shifts to the right."
  },
  {
    id: 78,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "Which group in the periodic table represents the alkaline earth metals?",
    options: ["Group 1", "Group 2", "Group 16", "Group 17"],
    answerIndex: 1,
    explanation: "Group 2 elements (Beryllium, Magnesium, Calcium, Strontium, Barium, Radium) are called the alkaline earth metals. They have two valence electrons."
  },
  {
    id: 79,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the correct chemical formula for common table salt?",
    options: ["NaHCO₃", "NaCl", "NaOH", "HCl"],
    answerIndex: 1,
    explanation: "Table salt is Sodium Chloride, an ionic compound formed from sodium cations (Na+) and chloride anions (Cl-), represented by the empirical formula NaCl."
  },
  {
    id: 80,
    category: "Chemical Bonding",
    difficulty: "Medium",
    question: "Which type of chemical bond is characterized by the sharing of valence electron pairs between atoms?",
    options: ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
    answerIndex: 1,
    explanation: "Covalent bonds form when nonmetal atoms share valence electrons to establish a stable, closed-valence shell configuration (octet)."
  },
  {
    id: 81,
    category: "Atomic Structure",
    difficulty: "Hard",
    question: "Which of the following electron configurations corresponds to a transition metal atom in its ground state?",
    options: ["[Ar] 4s²", "[Ne] 3s² 3p⁵", "[Ar] 3d⁵ 4s¹", "[Xe] 6s¹"],
    answerIndex: 2,
    explanation: "[Ar] 3d⁵ 4s¹ is the electron configuration of Chromium (Cr), a d-block transition metal. The configuration is stable due to the half-filled d-subshell."
  },
  {
    id: 82,
    category: "Acids & Bases",
    difficulty: "Hard",
    question: "What conjugate base is formed when sulfuric acid (H₂SO₄) donates a single proton?",
    options: ["SO₄(2-)", "HSO₄(-)", "H₃SO₄(+)", "SO₃(2-)"],
    answerIndex: 1,
    explanation: "A conjugate base is formed by removing one H+ from an acid. Removing a single proton (H+) from H₂SO₄ yields the hydrogen sulfate ion (HSO₄-)."
  },
  {
    id: 83,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the primary gaseous product released during biological photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Water Vapor"],
    answerIndex: 2,
    explanation: "During photosynthesis, plants convert carbon dioxide and water into glucose and release Oxygen gas (O₂) as a byproduct: 6CO₂ + 6H₂O -> C₆H₁₂O₆ + 6O₂."
  },
  {
    id: 84,
    category: "Gases & Solutions",
    difficulty: "Medium",
    question: "Which gas law states that at a constant pressure, the volume of a fixed mass of gas is directly proportional to its absolute temperature?",
    options: ["Boyle's Law", "Charles's Law", "Avogadro's Law", "Dalton's Law"],
    answerIndex: 1,
    explanation: "Charles's Law states that V ∝ T at constant pressure, which means V₁/T₁ = V₂/T₂ when temperature is measured on the absolute Kelvin scale."
  },
  {
    id: 85,
    category: "Organic Chemistry",
    difficulty: "Hard",
    question: "What is the characteristic functional group found in all organic alcohols?",
    options: ["Carbonyl (-CO-)", "Carboxyl (-COOH)", "Hydroxyl (-OH)", "Amino (-NH2)"],
    answerIndex: 2,
    explanation: "Alcohols contain the Hydroxyl (-OH) functional group covalently bonded to a saturated carbon atom (e.g., Ethanol, CH₃CH₂OH)."
  },
  {
    id: 86,
    category: "Lab Safety",
    difficulty: "Easy",
    question: "Why is it strictly forbidden to consume food or beverages inside a chemistry laboratory?",
    options: ["Food might spoil quickly", "Accidental ingestion of toxic chemical residues can occur", "Lab reagents could make the food taste bad", "It is distracting to other students"],
    answerIndex: 1,
    explanation: "Eating or drinking in the lab creates a major safety risk of consuming chemical dust, vapors, or spill residues that might contaminate the food or hands."
  },
  {
    id: 87,
    category: "Chemical Reactions",
    difficulty: "Hard",
    question: "In a redox reaction, what chemical event does reduction represent?",
    options: ["Loss of protons", "Gain of protons", "Loss of electrons", "Gain of electrons"],
    answerIndex: 3,
    explanation: "According to the OIL RIG mnemonic: Oxidation Is Loss, Reduction Is Gain. Reduction represents the gain of electrons by a chemical species, lowering its oxidation state."
  },
  {
    id: 88,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "Which of the following elements is classified as a metalloid (exhibiting both metallic and nonmetallic properties)?",
    options: ["Sodium", "Silicon", "Sulfur", "Iron"],
    answerIndex: 1,
    explanation: "Silicon (Si) is a classic metalloid. It forms a covalent network lattice like nonmetals but behaves as a semiconductor, allowing electrical conductivity under certain conditions like metals."
  },
  {
    id: 89,
    category: "Gases & Solutions",
    difficulty: "Hard",
    question: "What is the molarity (M) of a solution prepared by dissolving 2.0 moles of solute in enough water to yield 4.0 liters of final solution?",
    options: ["0.5 M", "2.0 M", "4.0 M", "8.0 M"],
    answerIndex: 0,
    explanation: "Molarity (M) is moles of solute per liter of solution. M = 2.0 moles / 4.0 liters = 0.5 M (mol/L)."
  },
  {
    id: 90,
    category: "Chemical Bonding",
    difficulty: "Medium",
    question: "How many single covalent bonds are present in a single molecule of methane (CH₄)?",
    options: ["1", "2", "3", "4"],
    answerIndex: 3,
    explanation: "Methane consists of a central Carbon atom forming 4 separate single covalent bonds with 4 individual Hydrogen atoms (tetrahedral structure)."
  },
  {
    id: 91,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What is the molecular formula of water?",
    options: ["HO2", "H2O", "H2O2", "H3O"],
    answerIndex: 1,
    explanation: "Water consists of 2 Hydrogen atoms covalently bonded to 1 Oxygen atom, yielding the molecular formula H₂O."
  },
  {
    id: 92,
    category: "Organic Chemistry",
    difficulty: "Hard",
    question: "Which of the following represents the general formula for acyclic alkanes?",
    options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
    answerIndex: 1,
    explanation: "Saturated open-chain hydrocarbons (alkanes) follow the general formula C_n H_{2n+2}, where n is the number of Carbon atoms (e.g. Propane is C₃H₈)."
  },
  {
    id: 93,
    category: "Atomic Structure",
    difficulty: "Medium",
    question: "Which scientist discovered the electron in 1897 using cathode ray tube experiments?",
    options: ["Ernest Rutherford", "John Dalton", "J.J. Thomson", "Niels Bohr"],
    answerIndex: 2,
    explanation: "J.J. Thomson showed that cathode rays were composed of previously unknown negatively charged particles, which were later named electrons. He proposed the 'plum pudding' model of the atom."
  },
  {
    id: 94,
    category: "Acids & Bases",
    difficulty: "Hard",
    question: "Which of the following substances behaves as a weak acid in aqueous solution?",
    options: ["Hydrochloric Acid (HCl)", "Nitric Acid (HNO3)", "Acetic Acid (CH3COOH)", "Sulfuric Acid (H2SO4)"],
    answerIndex: 2,
    explanation: "Acetic Acid (CH₃COOH) is a weak organic acid that only partially dissociates in water, whereas HCl, HNO₃, and H₂SO₄ are mineral acids that dissociate 100%."
  },
  {
    id: 95,
    category: "Lab Safety",
    difficulty: "Easy",
    question: "What should you immediately do if a concentrated chemical spill occurs on your skin in the lab?",
    options: ["A paper towel", "Plenty of running water", "A neutralizing acid or base", "Soap and hand sanitizer only"],
    answerIndex: 1,
    explanation: "For chemical spills on the skin, immediately flush the area with massive amounts of running water under a safety shower or tap for at least 15 minutes. Do not attempt to neutralize it with other chemicals, as neutralization reactions release heat and cause further damage."
  },
  {
    id: 96,
    category: "Chemical Reactions",
    difficulty: "Hard",
    question: "What is the term for a substance that increases the rate of a chemical reaction without undergoing any permanent chemical change itself?",
    options: ["Reactant", "Product", "Catalyst", "Inhibitor"],
    answerIndex: 2,
    explanation: "A catalyst speeds up reactions by offering an alternative pathway with lower activation energy, and it is fully recovered unchanged at the end of the reaction."
  },
  {
    id: 97,
    category: "Periodic Table",
    difficulty: "Medium",
    question: "What trend is observed in the atomic radius of elements as you move from left to right across a single period?",
    options: ["It increases", "It decreases", "It remains the same", "It increases then decreases"],
    answerIndex: 1,
    explanation: "Moving left to right across a period, the atomic number (number of protons) increases, increasing the effective nuclear charge. This pulls the valence electron cloud closer to the nucleus, causing atomic radius to decrease."
  },
  {
    id: 98,
    category: "Gases & Solutions",
    difficulty: "Hard",
    question: "Which gas law states that the total pressure of a mixture of non-reacting gases is equal to the sum of their individual partial pressures?",
    options: ["Ideal Gas Law", "Boyle's Law", "Dalton's Law of Partial Pressures", "Charles's Law"],
    answerIndex: 2,
    explanation: "Dalton's Law of Partial Pressures states that P_total = P₁ + P₂ + P₃ + ... for a mixture of ideal, non-reacting gases in a shared volume."
  },
  {
    id: 99,
    category: "General Chemistry",
    difficulty: "Easy",
    question: "What color does blue litmus paper turn when exposed to an acidic solution (pH < 7)?",
    options: ["Blue", "Green", "Red", "Yellow"],
    answerIndex: 2,
    explanation: "Acidic solutions protonate the blue litmus dye conjugate base, causing it to change structure and turn red."
  },
  {
    id: 100,
    category: "Chemical Bonding",
    difficulty: "Hard",
    question: "Which of the following molecules contains a carbon-carbon triple bond ($C\\equiv C$)?",
    options: ["Ethane (C2H6)", "Ethene (C2H4)", "Ethyne (C2H2)", "Propane (C3H8)"],
    answerIndex: 2,
    explanation: "Ethyne (also known as acetylene, C₂H₂) is an alkyne with a triple bond sharing 3 pairs of electrons between the two Carbon atoms: H-C≡C-H."
  }
];

export default function QuizPage() {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'finished'
  const [quizSize, setQuizSize] = useState(10) // 10, 25, 50, 100
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null) // index of selected option
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [userAnswers, setUserAnswers] = useState([]) // array of objects { questionId, selectedIndex, isCorrect }



  // Game setup
  const startQuiz = (size) => {
    setQuizSize(size)
    
    // Shuffle and pick questions
    const shuffled = [...chemistryQuestions].sort(() => 0.5 - Math.random())
    const selected = size === chemistryQuestions.length ? chemistryQuestions : shuffled.slice(0, size)
    
    setSelectedQuestions(selected)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setHasSubmitted(false)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(30)
    setUserAnswers([])
    setGameState('playing')
  }

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing' || hasSubmitted) return

    if (timeLeft === 0) {
      handleAnswerSubmit(null, true) // Time ran out
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, gameState, hasSubmitted])

  const handleAnswerSelect = (optionIdx) => {
    if (hasSubmitted) return
    setSelectedAnswer(optionIdx)
  }

  const handleAnswerSubmit = (forcedIdx = null, timeRanOut = false) => {
    if (hasSubmitted) return
    
    const finalSelection = forcedIdx !== null ? forcedIdx : selectedAnswer
    const currentQuestion = selectedQuestions[currentIndex]
    
    const isCorrect = !timeRanOut && finalSelection === currentQuestion.answerIndex
    
    // Update score and streaks
    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => {
        const next = prev + 1
        if (next > maxStreak) setMaxStreak(next)
        return next
      })
    } else {
      setStreak(0)
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        options: currentQuestion.options,
        selectedIndex: finalSelection,
        correctIndex: currentQuestion.answerIndex,
        explanation: currentQuestion.explanation,
        isCorrect,
        timeOut: timeRanOut
      }
    ])

    setHasSubmitted(true)
  }

  const handleNext = () => {
    if (currentIndex + 1 < selectedQuestions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setHasSubmitted(false)
      setTimeLeft(30)
    } else {
      setGameState('finished')
    }
  }

  // Rank / Title calculator
  const getRank = (percentage) => {
    if (percentage >= 90) return { title: "Noble Gas Master", desc: "Chemically stable and absolutely perfect! You have full mastery of atomic systems.", color: "var(--cat-noble-gas)" }
    if (percentage >= 75) return { title: "Transition Metal Catalyst", desc: "Highly adaptive, conductive, and fast! You accelerate every reaction with ease.", color: "var(--cat-transition-metal)" }
    if (percentage >= 50) return { title: "Alkali Spark", desc: "Energetic and reactive! With a bit more activation energy, you will explode with knowledge.", color: "var(--cat-alkali-metal)" }
    return { title: "Inert Matter", desc: "Currently in a stable ground state. Re-absorb some heat energy and try again to react!", color: "var(--text-muted)" }
  }

  const percentage = Math.round((score / quizSize) * 100)
  const rank = getRank(percentage)

  return (
    <div className="page-view explore-page" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* ==========================================
         🎮 STATE A: QUIZ INTRO MENU
         ========================================== */}
      {gameState === 'menu' && (
        <section className="page-hero glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
          <div className="brand-icon" style={{ width: '60px', height: '60px', marginBottom: '1rem' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span className="hero-eyebrow">Interactive Assessment</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Chemistry Knowledge Challenge</h1>
          <p className="hero-description" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Test your limits and earn your chemical title! Our quiz contains exactly 100 curated academic questions spanning atomic physics, organic chemistry, lab safety protocols, bonding mechanics, and acids.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
            
            {/* Mode A: Sprint */}
            <div className="glass-card info-card" style={{ flex: '1', minWidth: '220px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => startQuiz(10)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--cat-post-transition-metal)' }}>Fast Assessment</span>
                <Clock size={18} style={{ color: 'var(--cat-post-transition-metal)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>10 Question Sprint</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>A quick test to check your core concepts under time limits. Perfect for speed drills!</p>
              <button className="action-btn action-btn-secondary" style={{ marginTop: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>Start Sprint</button>
            </div>

            {/* Mode B: Practice */}
            <div className="glass-card info-card" style={{ flex: '1', minWidth: '220px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => startQuiz(25)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>Medium Test</span>
                <Trophy size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>25 Question Midterm</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>A balanced exam mapping chemical equations, bonding types, and acidic strengths.</p>
              <button className="action-btn action-btn-secondary" style={{ marginTop: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>Start Midterm</button>
            </div>

            {/* Mode C: Semi-Marathon */}
            <div className="glass-card info-card" style={{ flex: '1', minWidth: '220px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => startQuiz(50)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--cat-noble-gas)' }}>Large Test</span>
                <Zap size={18} style={{ color: 'var(--cat-noble-gas)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>50 Question Challenge</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>A heavy assessment testing half the question pool in a randomized selection.</p>
              <button className="action-btn action-btn-secondary" style={{ marginTop: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem' }}>Start Semi-Marathon</button>
            </div>

            {/* Mode D: Full Marathon */}
            <div className="glass-card info-card" style={{ flex: '1', minWidth: '220px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', border: '1px solid rgba(236, 72, 153, 0.2)' }} onClick={() => startQuiz(100)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--cat-noble-gas)' }}>Extreme Challenge</span>
                <Zap size={18} style={{ color: 'var(--cat-noble-gas)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>100 Question Marathon</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>The ultimate laboratory challenge! Tests every single question in the master database.</p>
              <button className="action-btn action-btn-primary" style={{ marginTop: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, var(--cat-noble-gas), var(--primary))' }}>Start Marathon</button>
            </div>

          </div>
        </section>
      )}

      {/* ==========================================
         🎮 STATE B: ACTIVE QUIZ SCREEN
         ========================================== */}
      {gameState === 'playing' && selectedQuestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Progress Indicators */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Question {currentIndex + 1} of {quizSize}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                {selectedQuestions[currentIndex].category}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Streak Badge */}
              {streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning)', fontWeight: '800', animation: 'pulse 1s infinite' }}>
                  <Zap size={16} fill="currentColor" />
                  <span>Streak {streak}x 🔥</span>
                </div>
              )}

              {/* Timer Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft <= 5 ? 'var(--danger)' : 'var(--text-primary)', transition: 'color 0.3s' }}>
                <Clock size={16} />
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '1rem' }}>{timeLeft}s</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--cat-noble-gas))', width: `${((currentIndex) / quizSize) * 100}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Core Question Card */}
          <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <HelpCircle size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Difficulty: {selectedQuestions[currentIndex].difficulty}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>
                {selectedQuestions[currentIndex].question}
              </h2>
            </div>

            {/* Answer Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedQuestions[currentIndex].options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === oIdx
                const isCorrectAnswer = oIdx === selectedQuestions[currentIndex].answerIndex
                
                // Color codes
                let borderCol = 'var(--glass-border)'
                let bgCol = 'rgba(255,255,255,0.02)'
                let glow = 'none'

                if (hasSubmitted) {
                  if (isCorrectAnswer) {
                    borderCol = 'var(--success)'
                    bgCol = 'rgba(16, 185, 129, 0.1)'
                    glow = '0 0 10px rgba(16, 185, 129, 0.2)'
                  } else if (isSelected) {
                    borderCol = 'var(--danger)'
                    bgCol = 'rgba(239, 68, 68, 0.1)'
                    glow = '0 0 10px rgba(239, 68, 68, 0.2)'
                  }
                } else if (isSelected) {
                  borderCol = 'var(--primary)'
                  bgCol = 'rgba(99, 102, 241, 0.1)'
                  glow = '0 0 10px var(--primary-glow)'
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSelect(oIdx)}
                    disabled={hasSubmitted}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.15rem 1.5rem',
                      width: '100%',
                      background: bgCol,
                      border: `1px solid ${borderCol}`,
                      borderRadius: '12px',
                      color: hasSubmitted && !isCorrectAnswer && !isSelected ? 'var(--text-muted)' : '#fff',
                      fontSize: '1rem',
                      textAlign: 'left',
                      cursor: hasSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: glow
                    }}
                    className={!hasSubmitted ? 'info-card' : ''}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                    
                    {hasSubmitted && isCorrectAnswer && (
                      <CheckCircle size={18} style={{ marginLeft: 'auto', color: 'var(--success)' }} />
                    )}
                    {hasSubmitted && isSelected && !isCorrectAnswer && (
                      <XCircle size={18} style={{ marginLeft: 'auto', color: 'var(--danger)' }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <div>
                {!hasSubmitted && selectedAnswer === null && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select an option to submit your answer</span>
                )}
              </div>
              
              {!hasSubmitted ? (
                <button
                  className="action-btn action-btn-primary"
                  onClick={() => handleAnswerSubmit()}
                  disabled={selectedAnswer === null}
                  style={{ padding: '0.75rem 2rem', opacity: selectedAnswer === null ? 0.5 : 1 }}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  className="action-btn action-btn-primary"
                  onClick={handleNext}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}
                >
                  <span>{currentIndex + 1 === quizSize ? 'Finish Quiz' : 'Next Question'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Scientific Explanation Card */}
          {hasSubmitted && (
            <div
              className={`glass-card ${userAnswers[currentIndex]?.isCorrect ? 'reactive' : 'explosive'}`}
              style={{
                padding: '1.5rem 2rem',
                animation: 'fade-in 0.3s ease-out',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                background: userAnswers[currentIndex]?.isCorrect ? 'var(--success-glow)' : 'var(--danger-glow)',
                color: userAnswers[currentIndex]?.isCorrect ? 'var(--success)' : 'var(--danger)',
                padding: '0.5rem',
                borderRadius: '8px',
                flexShrink: 0
              }}>
                {userAnswers[currentIndex]?.isCorrect ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem', color: '#fff' }}>
                  {userAnswers[currentIndex]?.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {selectedQuestions[currentIndex].explanation}
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==========================================
         🎮 STATE C: PERFORMANCE CERTIFICATE & STATISTICS
         ========================================== */}
      {gameState === 'finished' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Certificate Block */}
          <section className="glass-card" style={{ padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '30%', height: '30%', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '30%', height: '30%', background: 'rgba(236,72,153,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '2px solid rgba(255,255,255,0.08)',
              padding: '1.25rem',
              borderRadius: '50%',
              color: rank.color,
              boxShadow: `0 0 30px ${rank.color}22`
            }}>
              <Award size={48} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>CHEMISTRY ASSESSMENT PORTAL</span>
              <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: '800', background: 'linear-gradient(135deg, #fff 40%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Course Grade: <span style={{ color: rank.color, WebkitTextFillColor: 'initial' }}>{rank.title}</span>
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', fontSize: '1rem', lineHeight: '1.7' }}>
              {rank.desc} You answered <strong>{score}</strong> out of <strong>{quizSize}</strong> questions correctly ({percentage}% success rate) in this assessment.
            </p>

            {/* Score Grid details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', maxWidth: '650px', marginTop: '1rem' }}>
              <div className="glass-card" style={{ flex: '1', minWidth: '130px', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.25rem' }}>Score</span>
                <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{score}/{quizSize}</strong>
              </div>
              <div className="glass-card" style={{ flex: '1', minWidth: '130px', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.25rem' }}>Percentage</span>
                <strong style={{ fontSize: '1.5rem', color: rank.color }}>{percentage}%</strong>
              </div>
              <div className="glass-card" style={{ flex: '1', minWidth: '130px', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.25rem' }}>Max Streak</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <Zap size={16} fill="currentColor" /> {maxStreak}x
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="action-btn action-btn-primary" onClick={() => startQuiz(quizSize)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={16} />
                <span>Retry Challenge</span>
              </button>
              
              <button className="action-btn action-btn-secondary" onClick={() => setGameState('menu')}>
                Back to Menu
              </button>
            </div>
          </section>

          {/* Detailed Question Review List */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: '#fff' }}>
              Comprehensive Question Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {userAnswers.map((ua, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    borderBottom: idx + 1 < userAnswers.length ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    paddingBottom: idx + 1 < userAnswers.length ? '1.5rem' : '0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: ua.isCorrect ? 'var(--success-glow)' : 'var(--danger-glow)',
                      color: ua.isCorrect ? 'var(--success)' : 'var(--danger)',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      flexShrink: 0,
                      marginTop: '0.15rem'
                    }}>
                      {idx + 1}
                    </span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>
                        {ua.questionText}
                      </h4>
                      
                      {/* Selection Audit */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Your Choice: <strong style={{ color: ua.timeOut ? 'var(--danger)' : ua.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                            {ua.timeOut ? "Time Out" : ua.options[ua.selectedIndex]}
                          </strong>
                        </span>
                        
                        {!ua.isCorrect && (
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Correct Answer: <strong style={{ color: 'var(--success)' }}>{ua.options[ua.correctIndex]}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', borderLeft: `2px solid ${ua.isCorrect ? 'var(--success)' : 'var(--danger)'}`, padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', marginLeft: '1.8rem', lineHeight: '1.5' }}>
                    <strong>Scientific Analysis:</strong> {ua.explanation}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
