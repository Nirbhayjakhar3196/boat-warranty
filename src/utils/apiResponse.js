import { NextResponse } from "next/server";

export function successResponse(
  message,
  data = null,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message,
  status = 500,
  errors = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}