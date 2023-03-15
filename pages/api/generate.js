import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const location = req.body.location || '';
  if (location.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid location",
      }
    });
    return;
  }

const days = req.body.days || '';
if (parseInt(days).length > 3) {
  res.status(400).json({
    error: {
      message: "Please enter a valid duration in days",
    }
  });
  return;
}

const budget = req.body.budget || '';
if (budget.trim().length === 0) {
  res.status(400).json({
    error: {
      message: "Please select a budget.",
    }
  });
  return;
}

const experience = req.body.experience || '';
if (experience.trim().length === 0) {
  res.status(400).json({
    error: {
      message: "Please enter a valid experience (relaxing, sightseeing, safari etc.)",
    }
  });
  return;
}

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(location,days,budget,experience),
      max_tokens:2048,
      temperature: 0.4,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(location,days,budget,experience) {
  const capitalizedLocation =
    location[0].toUpperCase() + location.slice(1).toLowerCase();

  const parsedDays = parseInt(days);
  const Experience = experience;
  const Budget = budget;
    location[0].toUpperCase() + location.slice(1).toLowerCase();
  return `Create a  detailed itinerary for a vacation.

Location: ${capitalizedLocation}
Days: ${parsedDays}
Budget:${Budget}
Experience:${Experience}
Itinerary:`;
}
;
