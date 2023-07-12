import { revalidatePath } from "next/cache";
import Task from "./task";

export default async function Home() {

  const tasksReq = await fetch('http://127.0.0.1:5000/todo', { next: { revalidate: 0 } });
  const data = await tasksReq.json();

  const taskHandler = async (data) => {
    "use server";
    const fetchData = { description: data.get('description') };
    await fetch('http://127.0.0.1:5000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fetchData)
    });
    revalidatePath('/');
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col gap-3">
      <form className="join" action={taskHandler}>
        <input name="description" className="!rounded-tl-lg !rounded-bl-lg input input-bordered join-item" placeholder="Add new task"/>
        <button type="submit" className="btn btn-primary join-item">Add</button>
      </form>
      <div className="flex flex-col gap-3 w-[500px]">
        {data.tasks.map(taskInfo => (
          <Task info={taskInfo} />
        ))}
      </div>
    </div>
  )
}
