import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [locationInput, setLocationInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [budgetInput, setbudgetInput] = useState("");
  const [experienceInput, setexperienceInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: locationInput, days: daysInput, budget: budgetInput , experience: experienceInput }),
      },
      );     

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setLocationInput("");
      setDaysInput("");
      setexperienceInput("");
      setbudgetInput();
      loader.hidden = true;
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Itinerary Generator</title>
        <link rel="icon" href="/luggage.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

      </Head>

      <main className={styles.main}>
        <img src="/luggage.png" className={styles.icon} />
        <h3>Create an itinerary</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="location"
            placeholder="Where do you want to go?"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            
          />

          <input
            type="text"
            name="days"
            placeholder="How long is your visit? (in days)"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
          />

          <div>
          <p> Budget: </p>

          <div>
            <input type="radio" name="normal" value="normal" id="normal" onChange={(e) => (setbudgetInput(e.target.value),premium.checked = false,exclusive.checked = false)}/>
            <label for="normal">normal</label>
          </div>

          <div>
            <input type="radio" name="premium" value="premium" id="premium" onChange={(e) => (setbudgetInput(e.target.value),normal.checked = false,exclusive.checked = false)}/>
            <label for="premium">premium</label>
          </div>

          <div>
            <input type="radio" name="exclusive" value="exclusive" id="exclusive" onChange={(e) => (setbudgetInput(e.target.value),premium.checked = false,normal.checked = false)}/>
            <label for="exclusive">exclusive</label>           
          </div>
          </div> 

          <input
            type="text"
            name="experience"
            placeholder="What type of experience? (safari,romantic,family etc.)"
            value={experienceInput}
            onChange={(e) => setexperienceInput(e.target.value)}
          />

        <div> 
        
          <input type="submit" value="Generate itinerary" onClickCapture={(e) => loader.hidden = false} />    
          
          <label class="loader" name="loader" id="loader" hidden = "true">
          <i class="fa fa-spinner fa-spin"></i>
          </label>

        </div>    

        </form> 
        <div className={styles.result}  > {result} </div> 
             
      </main>
      
    </div>
  );
}
