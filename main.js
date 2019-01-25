let database = firebase.database();
let days = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"];

const getSelectorValues = () => {
  let inputs = document.querySelectorAll('input');
  let problem = inputs[0].value;
  let name = inputs[1].value;

  let selectors = document.querySelectorAll('select');
  let type = selectors[0].options[selectors[0].selectedIndex].value;
  let day = selectors[1].options[selectors[1].selectedIndex].value;

  return [type, day];
}

const createProblem = () => {
  let inputs = document.querySelectorAll('input');
  let problem = inputs[0].value;
  let name = inputs[1].value;

  let selectorArray = getSelectorValues();
  let type = selectorArray[0];
  let day = selectorArray[1];

  let d = new Date();
  let date = days[d.getDay() - 1] + " klokka " + d.getHours() + ":" + d.getMinutes();
  database.ref('problemer/' + day).push().set({
    type: type,
    name: name,
    problem: problem,
    date: date
  });
}

const refreshProblems = () => {
  let selectorArray = getSelectorValues();
  let type = selectorArray[0];
  let day = selectorArray[1];

  let ref = firebase.database().ref('problemer/' + day);
  ref = ref.orderByChild('type').equalTo(type);
  ref.on('value', function(snapshot) {
    console.log(snapshot.val());
    addToUI(snapshot.val());
  });
}

const addToUI = (list) => {
  let parent = document.getElementById("problems");
  parent.innerHTML = null;

  for (const i in list) {
    const el = `
      <div class="problem-item" id="${i}">
        <div class="info">
          <p id="name">${list[i]['name']}</p>
          <span id="sep"></span>
          <p id="problem">${list[i]['problem']}</p>
        </div>
        <button id="remove" onclick="removeProblem('${i}')"><i data-feather="trash-2"></i></button>
      </div>`

      parent.innerHTML += el;
  }

  feather.replace();
}

const removeProblem = (id) => {
  // Remove it form UI
  let el = document.getElementById(id);
  el.parentNode.removeChild(el);

  //Remove it from db
  let selectEl = document.getElementById('day');
  let day = selectEl.options[selectEl.selectedIndex].value;

  let ref = database.ref('preoblemer/' + day).child(id);
  ref.remove(function(err) {
    if (err != null) {
      console.error("[ERROR] Something went wrong: " + err);
    }
  })
}
