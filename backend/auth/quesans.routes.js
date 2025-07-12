import express from "express";
import { createAnswer, createQuestion, downvoteAnswer, downvoteQuestion, getAnswer, getQuestion, getQuestions, updateAnswer, updateQuestion, upvoteAnswer, upvoteQuestion } from "../controllers/quesans.controller.js";
import auth from "../middleware/auth.middleware.js";



const router = express.Router();

router.post("/question" , auth, createQuestion);
router.post("/question/:id" , auth, updateQuestion);

router.post("/answer" , auth, createAnswer);
router.post("/answer/:id" , auth, updateAnswer);

router.get("/questions" , getQuestions);
router.get("/questions/:id" , getQuestion);

router.get("/answers/:id" , getAnswer);

router.put("/questions/:id/upvote" , auth, upvoteQuestion);
router.put("/questions/:id/downvote" , auth, downvoteQuestion);
router.put("/answers/:id/upvote" , auth, upvoteAnswer);
router.put("/answers/:id/downvote" , auth, downvoteAnswer);






export default router 
