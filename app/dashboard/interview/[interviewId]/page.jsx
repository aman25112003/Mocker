"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState({});
  const [webcamEnable, setWebcamEnable] = useState(false);

  useEffect(() => {
    console.log(interviewData);
    console.log(params.interviewId);
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    console.log(result);
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl ">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* INFORMATION SECTION */}
        <div className="flex flex-col my-5 gap-5">
          <div className="p-5 rounded-lg border flex flex-col gap-5">
            <h2 className="text-lg">
              {" "}
              <strong>Job Role/Job Position:</strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              {" "}
              <strong>Job Description/Tech Stack:</strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              {" "}
              <strong>Years of Experience:</strong>
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-red-600">
              {" "}
              <Lightbulb />
              <strong>IMPORTANT:</strong>
            </h2>
            <h2 className="mt-3">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        {/* CAMERA SECTION */}
        <div>
          {webcamEnable ? (
            <Webcam
              onUserMedia={() => setWebcamEnable(true)}
              onUserMediaError={() => setWebcamEnable(false)}
              mirrored={true}
              style={{
                border: "5px solid #5957D7", // Green solid border with 5px width
                borderRadius: "10px", // Rounded corners with 10px radius
                borderColor: "#5957D7", // Orange color for the border
                borderWidth: "5px", // Border width of 3px
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)", // Adding shadow for depth effect
                height: 450,
                width: 450,
              }}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button onClick={() => setWebcamEnable(true)}>
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
