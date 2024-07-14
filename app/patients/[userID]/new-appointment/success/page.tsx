import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appoinment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

export default async function SuccessPage({
  params: { userID },
  searchParams,
}: SearchParamProps) {
  const appointmentID = (searchParams?.appointmentID as string) || "";

  const appointment = await getAppointment(appointmentID);

  const user = await getUser(userID);

  Sentry.metrics.set("user_view_appointment-success", user.name);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={"/"}>
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src={"/assets/gifs/success.gif"}
            height={300}
            width={200}
            alt="success"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">Appointment request</span> has
            been successfully submited!
          </h2>
          <p>We will be in touch shortly to confirm</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src={"/assets/icons/calendar.svg"}
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant={"outline"} className="shad-primary-btn" asChild>
          <Link href={`/patients/${userID}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">&copy; 2024 CarePulse</p>
      </div>
    </div>
  );
}
