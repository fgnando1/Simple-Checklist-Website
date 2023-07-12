"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Task({ info }) {
    const router = useRouter();
    const [edit, setEdit] = useState(false);
    const [description, setDescription] = useState(info.description);
    const [crossed, setCrossed] = useState(info.isChecked);

    const editHandler = async (success) => {
        setEdit(false);
        if (!success) {
            setDescription(info.description);
            return;
        }

        const checkData = {
            id: info.id,
            description
        }

        await fetch('http://127.0.0.1:5000/todo', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkData)
        });
    }

    const deleteHandler = async () => {
        await fetch(`http://127.0.0.1:5000/todo?id=${info.id}`, { method: 'DELETE' });
        router.refresh();
    }

    const checkHandler = async (e) => {
        const check = e.target.checked;
        setCrossed(check);
        if (check) {
            setEdit(false);
            setDescription(info.description);
        }

        const checkData = {
            id: info.id,
            isChecked: check
        }

        await fetch('http://127.0.0.1:5000/todo', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkData)
        });
    }
    
    return (
        <div className={`flex justify-between items-center p-3 border rounded-lg ${crossed ? 'bg-base-300' : ''}`} >
            <div className="flex gap-3 items-center">
              <input type="checkbox" className="checkbox" defaultChecked={info.isChecked} onClick={checkHandler} />
              {edit ? (
                <input type="text" placeholder="Edit description" className="input w-full input-bordered" value={description} onChange={(e) => setDescription(e.target.value)} />
              ) : (
                <div className={crossed ? 'line-through' : ''}>
                    {description}
                </div>
              )}
            </div>
            {edit ? (
                <div className="join">
                    <button className="btn btn-sm join-item btn-success" onClick={() => editHandler(true)}>Save</button>
                    <button className="btn btn-sm join-item btn-ghost"  onClick={() => editHandler(false)}>Cancel</button>
                </div>  
            ) : (
                <div className="join">
                    <button className={`btn btn-sm join-item btn-ghost ${crossed ? 'btn-disabled' : ''}`} onClick={() => setEdit(true)}>Edit</button>
                    <button className={`btn btn-sm join-item btn-error ${crossed ? 'btn-disabled' : ''}`} onClick={deleteHandler}>Delete</button>
                </div>
            )}
        </div>
    )
}