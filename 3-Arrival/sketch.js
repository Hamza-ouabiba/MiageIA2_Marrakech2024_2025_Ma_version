let target, vehicle;
let vehicles = [];
let targets = [];
let font;
let mode = "snake";

// Appelée avant de démarrer l'animation, utile pour l'exercice avec text2points
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  target = createVector(0, 0);


  // Pour le texte
  // Dessin du texte en blanc
  targets = font.textToPoints('EMSI!', 116, 300, 335,
    { sampleFactor: 0.05 });

  creerDesVehicules(targets.length);

}

function creerDesVehicules(nb) {
  for (let i = 0; i < nb; i++) {
    let v = new Vehicle(random(width), random(height));
    vehicles.push(v);
  }
}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);


  // Draw a dot at each point.
  for (let p of targets) {
    push();
    fill(255);
    circle(p.x, p.y, 10);
    pop();
  }



  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible en rouge
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  vehicles.forEach((vehicle, index) => {
    if(mode === "snake") {
      if (index === 0) {
        // Le vehicule courant est le premier, il suit la target dirigée par la souris
        vehicle.applyBehaviors(target);
      } else {
        // Les autres vehicules suivent le vehicule précédent
        let vehiculePrecedent = vehicles[index - 1];
        vehicle.applyBehaviors(vehiculePrecedent.pos, 10);

        // On dessine une ligne transparente entre le véhicule courant et le véhicule précédent
        push();
        stroke(255, 50);
        strokeWeight(vehicle.r)
        line(vehicle.pos.x, vehicle.pos.y, vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);
        pop();
      }
    } else if(mode === "texte") {
      let t = createVector(targets[index].x, targets[index].y)
      let d = p5.Vector.dist(vehicle.pos, t);
      vehicle.applyBehaviors(t);
      // distance entre la souris et le véhicule
      let d2 = p5.Vector.dist(vehicle.pos, target);
      if (d2 < 30) {
        let force = vehicle.flee(target);
        vehicle.applyForce(force);
      }
    }

    vehicle.update();
    vehicle.show();
  });


}

function keyPressed() {
  switch (key) {
    case 'd':
      Vehicle.debug = !Vehicle.debug;
      break;
    case 's':
      mode = 'snake';
      break;
    case 't':
      mode = 'texte';
      break;
  }
}
