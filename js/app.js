//Create Calories Tracker/updater
class calorieTracker {
  constructor() {
    this._totalCalories = 2000;
    this._todaysCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._initialize();
  }

  addmeals(meals) {
    this._meals.push(meals);
    this._todaysCalories += meals.calories;
    this._renderdata();
  }

  addworkouts(workout) {
    this._workouts.push(workout);
    this._todaysCalories -= workout.calories;
    this._renderdata();
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

  _renderdata() {
    this.updatedailycalorie();
    this.dailycalorielost();
    this.calorieconsumed();
    this.calorieburned();
    this.caloriesRemaining();
    this.updateProgressbar();
  }

  _initialize() {
    this._renderdata();
  }
}

//Create Meals and Workouts
class Meal {
  constructor(mealname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = mealname;
    this.calories = calories;
  }
}

class Workout {
  constructor(workoutname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = workoutname;
    this.calories = calories;
  }
}

//app for final render
class App {
  constructor() {
    this.tracker = new calorieTracker();

    document
      .getElementById('meal-form')
      .addEventListener('submit', this.addnewmeal.bind(this));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this.addnewworkout.bind(this));
  }

  addnewmeal(e) {
    e.preventDefault();
    const mealel = document.getElementById('meal-name');
    const calorieel = document.getElementById('meal-calories');

    if (mealel.value === '' || calorieel === '') {
      alert('please fill all fields');
      return;
    }

    const meal = new Meal(mealel.value, +calorieel.value);

    this.tracker.addmeals(meal);
    mealel.value = '';
    calorieel.value = '';

    const collapseMeal = document.getElementById('collapse-meal');
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  addnewworkout(e) {
    e.preventDefault();
    const workoutEl = document.getElementById('workout-name');
    const workoutCalEl = document.getElementById('workout-calories');

    if (workoutEl.value === '' || workoutCalEl === '') {
      alert('please fill all fields');
      return;
    }

    const workout = new Workout(workoutEl.value, +workoutCalEl.value);

    this.tracker.addworkouts(workout);
    workoutEl.value = '';
    workoutCalEl.value = '';

    const collapseWorkout = document.getElementById('collapse-workout');
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

const startapp = new App();
