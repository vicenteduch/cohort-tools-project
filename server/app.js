const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

const Cohort = require("./models/Cohort.model");
const Students = require("./models/Student.model");

const PORT = 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohorts-api-tools")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohortsArr = require("./cohorts.json");
const stundetsArr = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors({ origin: ["http://localhost:5173/", "http://localhost:5005/"] }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohortsArr);
// });                                         <- DELETE THIS LATER, KEEPING JUST IN CASE

// app.get("/api/students", (req, res) => {
//   res.json(stundetsArr);
// });

// STUDENTS ROUTS

// post student

app.post("/api/students", (req, res, next) => {
  const newStudent = req.body;

  Students.create(newStudent)
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

// get student
app.get("/api/students", (req, res, next) => {
  Students.find()
    .populate("cohort")
    .then((studentFromDB) => {
      res.json(studentFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

// get student in cohort
app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Students.find({ cohort: cohortId })
    .populate("cohort")
    .then((studentFromDB) => {
      res.json(studentFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

// get student by id
app.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Students.findById(studentId)
    .populate("cohort")
    .then((studentFromDB) => {
      res.json(studentFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

// patch student
app.patch("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  const newStudent = req.body;

  Students.findByIdAndUpdate(studentId, newStudent, { new: true })
    .then((studentFromDB) => {
      res.json(studentFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

//Delete student

app.delete("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Students.findByIdAndDelete(studentId)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      next(error);
    });
});

//Cohort Routes

//POST new cohort

app.post("/api/cohorts", (req, res, next) => {
  const newCohort = req.body;

  Cohort.create(newCohort)
    .then((cohortFromDB) => {
      res.status(201).json(cohortFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

//GET all cohorts
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then((cohortsFromDB) => {
      res.status(200).json(cohortsFromDB);
    })
    .catch((e) => {
      next(error);
    });
});

//GET cohort by ID

app.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findOne({ _id: cohortId })
    .then((cohortFromDB) => {
      res.json(cohortFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

//PATCH cohort by ID

app.patch("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  const newDetails = req.body;

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
    .then((cohortFromDB) => {
      res.json(cohortFromDB);
    })
    .catch((error) => {
      next(error);
    });
});

//DELETE cohort

app.delete("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
