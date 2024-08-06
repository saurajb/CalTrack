//Create Calories Tracker/updater
class calorieTracker {
  constructor() {
    this._totalCalories = Storage.GetCalorieLimit();
    this._todaysCalories = Storage.GetDailyCalorie();
    this._meals = Storage.GetMeal();
    this._workouts = Storage.GetWorkout();
    this._renderdata();
    this.renderlist();
  }

  renderlist() {
    const mealItemsContainer = document.getElementById('meal-items');
    const workoutItemsContainer = document.getElementById('workout-items');
    mealItemsContainer.innerHTML = ''; // Clear existing meals
    workoutItemsContainer.innerHTML = ''; // Clear existing workouts
    this._meals.forEach((meal) => new MealList(meal));
    this._workouts.forEach((workout) => new WorkoutList(workout));
  }

  //update the meals values
  addmeals(meals) {
    this._todaysCalories += meals.calories;
    this._meals.push(meals); // Update internal meals list
    Storage.SetDailyCalorie(this._todaysCalories);
    Storage.SetMeal(meals);
    this._renderdata();
  }

  //update the workout values
  addworkouts(workout) {
    this._todaysCalories -= workout.calories;
    this._workouts.push(workout); // Update internal workouts list
    Storage.SetDailyCalorie(this._todaysCalories);
    Storage.SetWorkout(workout);
    this._renderdata();
  }

  removemeal(mealid) {
    const mealindex = this._meals.findIndex((meal) => meal.id == mealid);
    const meal = this._meals[mealindex];
    this._meals.splice(mealindex, 1);
    this._todaysCalories -= meal.calories;
    Storage.SetDailyCalorie(this._todaysCalories);
    this._renderdata();
    Storage.removemeal(mealid);
  }

  removeworkout(workoutid) {
    const workoutindex = this._workouts.findIndex(
      (workout) => workout.id == workoutid
    );
    const workout = this._workouts[workoutindex];
    console.log(workoutindex);
    this._workouts.splice(workoutindex, 1);
    this._todaysCalories += workout.calories;
    Storage.SetDailyCalorie(this._todaysCalories);
    this._renderdata();
    Storage.removeworkout(workoutid);
  }

  updatedailycalorie() {
    const DailyCalorie = document.querySelector('#calories-limit');
    DailyCalorie.innerHTML = `${this._totalCalories}`;
  }

  dailycalorielost() {
    const gainLoss = document.querySelector('#calories-total');
    const caloriediff = this._todaysCalories;
    gainLoss.innerHTML = `${caloriediff}`;
  }

  calorieconsumed() {
    const calorieconsumed = document.querySelector('#calories-consumed');
    let totalmealcal = 0;
    this._meals.forEach((meal) => {
      totalmealcal += meal.calories;
    });
    calorieconsumed.innerHTML = `${totalmealcal}`;
  }

  calorieburned() {
    const calorieburned = document.querySelector('#calories-burned');
    let totalworkoutcal = 0;
    this._workouts.forEach((workout) => {
      totalworkoutcal += workout.calories;
    });
    calorieburned.innerHTML = `${totalworkoutcal}`;
  }

  caloriesRemaining() {
    const progressEl = document.getElementById('calorie-progress');
    const calremaining = document.querySelector('#calories-remaining');
    const caloriediff = this._totalCalories - this._todaysCalories;
    calremaining.innerHTML = `${caloriediff}`;
    if (caloriediff <= 0) {
      calremaining.parentElement.classList.remove('bg-light');
      calremaining.parentElement.classList.add('bg-danger');
      progressEl.classList.add('bg-danger');
      progressEl.classList.remove('bg-success');
    } else {
      calremaining.parentElement.classList.remove('bg-danger');
      calremaining.parentElement.classList.add('bg-light');
      progressEl.classList.remove('bg-danger');
      progressEl.classList.add('bg-success');
    }
  }

  updateProgressbar() {
    const progressbar = document.querySelector('#calorie-progress');
    const progresspercent = (this._todaysCalories / this._totalCalories) * 100;
    const width = Math.min(progresspercent, 100);
    progressbar.style.width = `${width}%`;
  }

  resetcals() {
    this._todaysCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._renderdata();
    Storage.clearday();
  }

  setlimit(calval) {
    this._totalCalories = calval;
    Storage.SetCalorieLimit(calval);
    this.updatedailycalorie();
    this._renderdata();
  }

  _renderdata() {
    this.updatedailycalorie();
    this.dailycalorielost();
    this.calorieconsumed();
    this.calorieburned();
    this.caloriesRemaining();
    this.updateProgressbar();
  }
}

//Create Meals ID and info
class Meal {
  constructor(mealname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = mealname;
    this.calories = calories;
  }
}
//Create workout id and info
class Workout {
  constructor(workoutname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = workoutname;
    this.calories = calories;
  }
}

// adding the meals to the DOMlist
class MealList {
  constructor(meal, type) {
    this.meal = meal.name;
    this.calories = meal.calories;
    this.type = type;

    const mealItemsContainer = document.getElementById('meal-items');

    const div = document.createElement('div');
    div.classList.add('card', 'my-2');
    div.setAttribute('data-id', meal.id);
    div.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${this.meal}</h4>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
            ${this.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;
    mealItemsContainer.appendChild(div);
  }
}

// adding the workouts to the DOMlist
class WorkoutList {
  constructor(workout, type) {
    this.meal = workout.name;
    this.calories = workout.calories;
    this.type = type;

    const workoutItemsContainer = document.getElementById('workout-items');

    const div = document.createElement('div');
    div.classList.add('card', 'my-2');
    div.setAttribute('data-id', workout.id);
    div.innerHTML = `
                  <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${this.meal}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${this.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;
    workoutItemsContainer.appendChild(div);
  }
}

class Storage {
  static GetCalorieLimit(calolimit = 1000) {
    let updatedcal;
    if (localStorage.getItem('calorie-limit') === null) {
      updatedcal = calolimit;
    } else {
      updatedcal = JSON.parse(localStorage.getItem('calorie-limit'));
    }
    return updatedcal;
  }

  static SetCalorieLimit(calval) {
    JSON.stringify(localStorage.setItem('calorie-limit', calval));
  }

  static GetDailyCalorie(dailycal = 0) {
    let updatedcal;
    if (localStorage.getItem('daily-calorie') === null) {
      updatedcal = dailycal;
    } else {
      updatedcal = JSON.parse(localStorage.getItem('daily-calorie'));
    }
    return updatedcal;
  }

  static SetDailyCalorie(calval) {
    JSON.stringify(localStorage.setItem('daily-calorie', calval));
  }

  static GetMeal() {
    let updatedcal;
    if (localStorage.getItem('meals') === null) {
      updatedcal = [];
    } else {
      updatedcal = JSON.parse(localStorage.getItem('meals'));
    }
    return updatedcal;
  }

  static SetMeal(calval) {
    let existingmeals = Storage.GetMeal();
    existingmeals.push(calval);
    localStorage.setItem('meals', JSON.stringify(existingmeals));
  }

  static GetWorkout() {
    let updatedcal;
    if (localStorage.getItem('workouts') === null) {
      updatedcal = [];
    } else {
      updatedcal = JSON.parse(localStorage.getItem('workouts'));
    }
    return updatedcal;
  }

  static SetWorkout(calval) {
    let existingworkouts = Storage.GetWorkout();
    existingworkouts.push(calval);
    localStorage.setItem('workouts', JSON.stringify(existingworkouts));
  }

  static removemeal(id) {
    let currentmeals = Storage.GetMeal();
    currentmeals.forEach((meal, index) => {
      if (meal.id === id) {
        currentmeals.splice(index, 1);
      }
    });
    localStorage.setItem('meals', JSON.stringify(currentmeals));
  }

  static removeworkout(id) {
    let currentworkout = Storage.GetWorkout();
    currentworkout.forEach((workout, index) => {
      if (workout.id === id) {
        currentworkout.splice(index, 1);
      }
    });
    localStorage.setItem('workouts', JSON.stringify(currentworkout));
  }

  static clearday() {
    localStorage.clear();
  }
}

//app for final render
class App {
  constructor() {
    this.tracker = new calorieTracker();
    this.startEventlisteners();
  }

  startEventlisteners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this.addnewitem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this.addnewitem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this.removeitem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this.removeitem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this.filteritems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this.filteritems.bind(this, 'workout'));

    document
      .getElementById('add-meal-button')
      .addEventListener('click', this.focusformfield.bind(this, 'meal'));

    document
      .getElementById('add-workout-button')
      .addEventListener('click', this.focusformfield.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this.resetui.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this.setcalorielimit.bind(this));
  }

  addnewitem(type, e) {
    e.preventDefault();
    const mealel = document.getElementById('meal-name');
    const calorieel = document.getElementById('meal-calories');
    const workoutEl = document.getElementById('workout-name');
    const workoutCalEl = document.getElementById('workout-calories');

    //checking if fields of meals and workout is emppty
    if (type === 'meal') {
      if (mealel.value === '' || calorieel === '') {
        alert('please fill all fields');
        return;
      }
    }

    if (type === 'workout') {
      if (workoutEl.value === '' || workoutCalEl === '') {
        alert('please fill all fields');
        return;
      }
    }

    //Adding the meals & clearing form fields
    if (type === 'meal') {
      const meal = new Meal(mealel.value, +calorieel.value);
      this.tracker.addmeals(meal);
      const mealdisplay = new MealList(meal, 'food');

      mealel.value = '';
      calorieel.value = '';

      //collapse fields after inputing data
      const collapseMeal = document.getElementById('collapse-meal');
      const malCollapse = new bootstrap.Collapse(collapseMeal, {
        toggle: true,
      });
    }

    if (type === 'workout') {
      const workout = new Workout(workoutEl.value, +workoutCalEl.value);
      this.tracker.addworkouts(workout);
      const workoutdisplay = new WorkoutList(workout, 'food');

      workoutEl.value = '';
      workoutCalEl.value = '';

      //collapse fields after inputing data
      const collapseWorkout = document.getElementById('collapse-workout');
      const wrkoutCollapse = new bootstrap.Collapse(collapseWorkout, {
        toggle: true,
      });
    }
  }

  focusformfield(type) {
    if (type === 'meal') {
      document.getElementById('meal-name').focus();
    } else if (type === 'workout') {
      document.getElementById('workout-name').focus();
    }
  }

  removeitem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('are you sure?')) {
        const elementid = e.target.closest('.card').getAttribute('data-id');
        type === 'meal'
          ? this.tracker.removemeal(elementid)
          : this.tracker.removeworkout(elementid);
        e.target.closest('.card').remove();
      }
    }
  }

  filteritems(type, e) {
    const filtertext = e.target.value.toLowerCase();
    const item = document
      .querySelectorAll(`#${type}-items .card`)
      .forEach((card) => {
        const cardtext3 =
          card.firstElementChild.firstElementChild.firstElementChild
            .textContent;

        if (cardtext3.toLowerCase().indexOf(filtertext) !== -1) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
  }

  setcalorielimit(e) {
    e.preventDefault();

    const calval = document.getElementById('limit');

    if (calval.value === '') {
      alert('please enter a calorie limit');
    } else {
      this.tracker.setlimit(+calval.value);
      calval.value = '';
    }

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  resetui() {
    this.tracker.resetcals();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }
}

const startapp = new App();
