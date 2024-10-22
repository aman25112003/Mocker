"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidV4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState(false);
  const [jobDesc, setJobDesc] = useState(false);
  const [jobExperience, setJobExperience] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    const inputPrompt =
      "Job position:" +
      jobPosition +
      "Job Description:" +
      jobDesc +
      "Years of experience:" +
      jobExperience +
      "Depending on the job position,job description and years of experience give us" +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      "interview questions with their answers in json format . Give questions and answers as field in json";
    const result = await chatSession.sendMessage(inputPrompt);
    const mockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    JSON.stringify(mockJsonResponse);
    setJsonResponse(mockJsonResponse);

    if (mockJsonResponse) {
      const response = await db
        .insert(MockInterview)
        .values({
          mockId: uuidV4(),
          jsonMockResp: mockJsonResponse,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("Inserted Id:", response);
      if (response) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + response[0]?.mockId);
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl ">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about the Job you are interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your Job position/role,Job description and
                    years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job role/Job position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job description/Tech stack (In short)</label>
                    <Textarea
                      placeholder="Ex. React,Angular,Nodejs,Mysql"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating with AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;