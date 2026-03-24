import Interview from "../models/interview.model.js";

// 1. Create Interview (Only Student)
export const createInterview = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply" });
    }

    const { company, jobRole } = req.body;

    const interview = await Interview.create({
      studentId: req.user.id, // always take from logged-in user
      company,
      jobRole,
      rounds: [{ name: "Aptitude", status: "Pending" }],
    });

    res.status(201).json(interview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied to this company",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2. Add Next Round (Only Admin/Company)
export const addRound = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "company") {
      return res.status(403).json({ message: "Not allowed to add rounds" });
    }

    const { studentId, company, roundName } = req.body;

    const interview = await Interview.findOne({ studentId, company });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check last round is cleared
    const lastRound = interview.rounds[interview.rounds.length - 1];

    if (lastRound && lastRound.status !== "Cleared") {
      return res.status(400).json({
        message: "Previous round not cleared",
      });
    }

    interview.rounds.push({ name: roundName, status: "Pending" });

    await interview.save();

    res.json({ message: "Next round added", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Round Status (Only Admin/Company)
export const updateRoundStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "company") {
      return res.status(403).json({ message: "Not allowed to update rounds" });
    }

    const { studentId, company, roundName, status } = req.body;

    const interview = await Interview.findOne({ studentId, company });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const round = interview.rounds.find((r) => r.name === roundName);

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    round.status = status;

    // Auto update final result
    if (status === "Failed") {
      interview.result = "Rejected";
    }

    await interview.save();

    res.json({ message: "Round updated", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get Interview (Student can see own, Admin/Company can see all)
export const getInterview = async (req, res) => {
  try {
    const { studentId, company } = req.query;

    // If student → only allow own data
    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = await Interview.findOne({ studentId, company });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Count Students (Only Admin/Company)
export const getCompanyCount = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "company") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { company } = req.params;

    const count = await Interview.countDocuments({ company });

    res.json({ company, totalStudents: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
