"use client";
import { useState } from "react";
import { supabase } from "@/lib/server";
import { Button } from "@/components/ui/button";

type Data = {
  id: number;
  name: string;
};

type Props = {
  data: Data[];
};

async function fetchData(): Promise<Data[]> {
  const { data, error } = await supabase.from("models").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

const YourPage: React.FC<Props> = async () => {
  const [name, setName] = useState("");
  const data = await fetchData();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      // Refresh data or handle success
      setName("");
    } else {
      // Handle error
      console.error("Failed to upload data");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
        <Button type="submit">Submit</Button>
      </form>

      {data.map((item) => (
        <div key={item.id} className="text-fuchsia-200">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default YourPage;
