// @ts-nocheck — preserved source lesson and sketch generator.
export const lessons = [
  {
    id: 'blink', number: '01', title: 'A point of light', short: 'Make a circuit', icon: 'circle',
    description: 'A single LED becomes a tiny, breathing beacon. Learn how a breadboard connects a signal to light.',
    needs: 'From the table: Arduino, breadboard, 2 jumper wires. Find first: one ordinary LED, one 330 Ω resistor, and a USB data cable. These small components are not confirmed in the photos.',
    assumption: 'Reference build: Arduino UNO Rev3 (5 V logic). Confirm the board before following the pin map. This LED is an ordinary two-leg LED, not an addressable pixel.',
    steps: [
      ['Lay out the parts', 'Unplug USB. Put the breadboard beside the Arduino. On a standard breadboard, a–e in each numbered row connect together; f–j form a separate group. The center gap separates them. Our model uses rows 8, 12, and 16.'],
      ['Bring in the signal', 'Connect Arduino D9 to breadboard a8. D9 is a PWM pin on the UNO Rev3, so code can change the apparent brightness. Never connect an LED directly across a supply.'],
      ['Limit the current', 'Insert a 330 Ω resistor between e8 and e12. Then place the LED’s long leg (anode, +) in c12 and its short leg (cathode, −; flat side) in c16. The two LED legs must occupy different numbered rows.'],
      ['Complete the return path', 'Connect breadboard a16 to Arduino GND. Trace the loop: D9 → row 8 → resistor → row 12 → LED → row 16 → GND. A resistor has no polarity; the LED does.'],
      ['Give it a rhythm', 'Check the connections with USB unplugged, then connect USB. In Arduino IDE, choose your board and port and upload the sketch below. Start the browser preview to see the intended behavior.'],
    ],
    connections: [['D9', 'a8', 'Signal'], ['e8', 'e12', '330 Ω resistor'], ['c12 (+)', 'c16 (−)', 'LED'], ['a16', 'GND', 'Return']],
  },
  {
    id: 'strip', number: '02', title: 'A line of light', short: 'Address a pixel', icon: 'line',
    description: 'Eight independently controlled pixels turn a wire into a moving line. Power and data take different paths.',
    needs: 'From the table: Arduino, addressable-light packaging, jumper wires, three-wire connectors. Verify: 8 compatible 5 V WS2812B pixels. Find: 330 Ω resistor, 1000 µF capacitor rated ≥6.3 V, regulated enclosed 5 V supply rated ≥1 A, suitable terminals and USB cable.',
    assumption: 'Only for a verified 5 V WS2812B RGB strip and a 5 V-logic UNO Rev3. The photos do not establish LED type, voltage, or connector pinout. A 12 V strip or 3.3 V board needs a different design.',
    steps: [
      ['Read the actual labels', 'Disconnect all power. Verify 5 V WS2812B on the product label and identify +5V, GND, and DIN on the strip itself. The arrow points away from DIN. Wire colors and connector shape do not prove a pinout. Use an eight-pixel section, cut only at marked cut lines.'],
      ['Share a ground', 'Join supply DC −, strip GND, and Arduino GND at a suitable terminal. This shared reference lets the strip interpret the data. Use the separate supply for pixel power; do not run strip current through the Arduino or breadboard.'],
      ['Connect data to the input', 'Run Arduino D6 through a 330 Ω resistor to DIN, with the resistor close to the first pixel. DOUT is the other end. Leave it unconnected for this exercise. Keep this first data lead short.'],
      ['Connect pixel power', 'Connect supply DC + to strip +5V. Across strip +5V and GND, add a 1000 µF capacitor rated at least 6.3 V: + lead to +5V, striped − lead to GND. Leave the Arduino 5V pin unconnected to this supply. Check polarity before powering.'],
      ['Send the first pattern', 'Install Adafruit NeoPixel in Arduino IDE’s Library Manager. Select the board and port. With wiring checked, power the pixels, then connect Arduino USB and upload. For shutdown, remove Arduino USB first, then pixel power. Unplug both before changing wiring.'],
    ],
    connections: [['Supply −', 'GND + Arduino GND', 'Shared return'], ['D6 → 330 Ω', 'DIN', 'Data'], ['Supply +5V', 'Strip +5V', 'Pixel power'], ['1000 µF + / −', '+5V / GND', 'Capacitor']],
  },
  {
    id: 'object', number: '03', title: 'A light in space', short: 'Build an object', icon: 'triangle',
    description: 'Fold the line into a triangular sculpture. The circuit stays the same; its placement changes what it means.',
    needs: 'Use the verified parts from exercise 02 with 24 pixels and an enclosed regulated 5 V supply rated ≥2 A. Add a nonconductive triangular support, spacers, and translucent paper diffuser; these materials are not confirmed in the photos.',
    assumption: 'Same verified 5 V WS2812B + UNO Rev3 setup as exercise 02. A conservative planning allowance is 60 mA per pixel: 24 × 60 mA = 1.44 A, before margin. Low software brightness is not an electrical protection device.',
    steps: [
      ['Make a small structure', 'Make a freestanding triangle from cardboard or another nonconductive material. Allow eight pixels per side. Mount the strip on the back using spacers, so reflected light outlines the form. Keep electronics accessible and ventilated.'],
      ['Route the shared ground', 'With both supplies disconnected, connect Arduino GND, supply DC −, and pixel GND at a terminal. The breadboard is for learning signal connections; it is not a distribution board for the sculpture’s power.'],
      ['Keep one data direction', 'Connect D6 through 330 Ω to the first DIN. Use one continuous strip if it bends gently without creasing. If making three sections, connect DOUT to the next DIN, +5V to +5V, and GND to GND. Insulate every joint.'],
      ['Power the sculpture', 'Connect the enclosed 5 V supply directly to the pixel power terminals. Fit the 1000 µF capacitor across +5V and GND with correct polarity. Do not connect the supply’s +5V to the USB-powered Arduino. Use wiring and connectors rated for the planned current.'],
      ['Compose a gesture', 'Install Adafruit NeoPixel; select the board and port. Set NUM_PIXELS to 24 as in this sketch. After checking wiring, power pixels before Arduino USB. Try a pulse, then a traveling point. Add a diffuser with an air gap and keep it away from warm components.'],
    ],
    connections: [['Supply −', 'GND + Arduino GND', 'Shared return'], ['D6 → 330 Ω', 'First DIN', 'Data'], ['DOUT', 'Next DIN', 'If segmented'], ['Supply +5V', 'Pixel +5V', 'Direct power']],
  },
];

export const artworks = [
  { title: 'The Lightwaves', artist: 'panGenerator', date: 'Documented 2020', type: 'Light', shape: 'waves', hardware: 'Arduino Nano · addressable RGB LEDs', text: 'Drumming sends waves of light toward a suspended sphere. Arduino documents Nano boards in the drum interfaces and 200 metres of addressable LEDs.', idea: 'Borrow the gesture: let a point of light travel along a line. Our exercise uses a timed pattern; a drum input would require an additional sensor.', url: 'https://blog.arduino.cc/2020/03/05/the-lightwaves-is-participatory-audio-visual-installation/' },
  { title: 'Into the Void', artist: 'Rodrigo Carvalho, with Ana Duarte, André Sousa & Daniel Correia', date: 'Documented 2016', type: 'Light', shape: 'triangles', hardware: 'Arduino Mega · LED strips · Max', text: 'LED strips behind triangular structures produce light and shadow. Computer-generated events coordinate the forms with sound and projected imagery.', idea: 'Borrow the form: hide the light behind a simple triangle. Our addressable-pixel circuit is a study, not the original artwork’s wiring.', url: 'https://blog.arduino.cc/2016/01/07/into-the-void-with-lights-and-shadows/' },
  { title: 'Flux', artist: 'Nicholas Stedman / Devicist Design Works', date: 'Documented 2022', type: 'Motion', shape: 'bars', hardware: '20 Arduino UNOs · stepper drivers · Raspberry Pi', text: 'Rotating reflective prisms turn coordinated movement into an installation. A Raspberry Pi coordinates twenty Arduino UNO boards; virtual simulation helps develop the patterns.', idea: 'Borrow the method: rehearse a sequence in 3D before building. Motors, drivers, and position sensors would be additional materials.', url: 'https://blog.arduino.cc/2022/10/04/flux-is-a-kinetic-art-installation-brought-to-life-with-arduino/' },
];

export function makeSketch(id, { color = '#1645ed', tempo = 1800, brightness = 20, pattern = 'pulse' } = {}) {
  if (id === 'blink') return `// A point of light — UNO Rev3, D9 -> 330 ohm -> LED -> GND\nconst int LED_PIN = 9;\nconst unsigned long PERIOD_MS = ${tempo};\nvoid setup() { pinMode(LED_PIN, OUTPUT); }\nvoid loop() {\n  float phase = (millis() % PERIOD_MS) / float(PERIOD_MS);\n  float level = (1.0 - cos(phase * TWO_PI)) * 0.5;\n  analogWrite(LED_PIN, int(level * 255 * ${brightness} / 100.0));\n  delay(10);\n}\n`;
  const rgb = color.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16));
  const count = id === 'strip' ? 8 : 24;
  return `// Verified 5 V WS2812B RGB pixels + UNO Rev3 only.\n// Separate regulated pixel power; shared GND; D6 -> 330 ohm -> DIN.\n// Install Adafruit NeoPixel with Arduino Library Manager.\n#include <Adafruit_NeoPixel.h>\nconst int NUM_PIXELS = ${count};\nconst unsigned long PERIOD_MS = ${tempo};\nAdafruit_NeoPixel pixels(NUM_PIXELS, 6, NEO_GRB + NEO_KHZ800);\nvoid setup() {\n  pixels.begin();\n  pixels.setBrightness(${Math.round(brightness * 255 / 100)});\n  pixels.clear();\n  pixels.show();\n}\nvoid loop() {\n  float phase = (millis() % PERIOD_MS) / float(PERIOD_MS);\n${pattern === 'pulse' ? `  float level = (1.0 - cos(phase * TWO_PI)) * 0.5;\n  uint32_t color = pixels.Color(int(${rgb[0]} * level), int(${rgb[1]} * level), int(${rgb[2]} * level));\n  pixels.fill(color);` : `  pixels.clear();\n  int head = int(phase * NUM_PIXELS) % NUM_PIXELS;\n  pixels.setPixelColor(head, pixels.Color(${rgb.join(', ')}));`}\n  pixels.show();\n  delay(10);\n}\n`;
}
