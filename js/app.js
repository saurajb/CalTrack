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
    const calremaining = document.querySelector('#calories-remaining');
    const caloriediff = this._totalCalories - this._todaysCalories;
    calremaining.innerHTML = `${caloriediff}`;
  }

  _renderdata() {
    this.updatedailycalorie();
    this.dailycalorielost();
    this.calorieconsumed();
    this.calorieburned();
    this.caloriesRemaining();
  }

  _initialize() {
    this._renderdata();
  }
}

//Create Meals and Workouts
class meal {
  constructor(mealname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = mealname;
    this.calories = calories;
  }
}

class workout {
  constructor(workoutname, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = workoutname;
    this.calories = calories;
  }
}

//Pass Meal and workouts into tracker
const tracker = new calorieTracker();
const breakfast = new meal('breakfast', 200);
const lunch = new meal('lunch', 300);
const dinner = new meal('dinner', 400);
const run = new workout('Morning Run', 300);
const gymworkout = new workout('Gym Workout', 500);

tracker.addmeals(breakfast);
tracker.addmeals(lunch);
tracker.addmeals(dinner);
tracker.addworkouts(run);
tracker.addworkouts(gymworkout);
