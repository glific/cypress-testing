export const messages = [
    {
      type: "sender",
      message: "dgnewcontact",
    },
    {
      type: "receiver",
      message: "Your language is currently set at English",
    },
    {
      type: "sender",
      message: "2",
    },
    {
      type: "receiver",
      message: "Welcome to our NGO bot.",
    },
    {
      type: "sender",
      message:"1"
    },
    {
      type: "receiver",
      message:"Are you seeing any leaf curl symptoms in your chilli crop as shown in the above image?"
    },
    {
      type: "sender",
      message:"yes"
    },
    {
      type: "reciever",
      message:"Tell us if your crop is in any of the following stages"
    },
    {
      type: "sender",
      message: "1",
      wait:1000
    },
    {
      type: "reciever",
      message:"Please share images of the impacted crop."
    },
    {
      type: "sender",
      attachment:"Image"
    },
    {
      type: "reciever",
      message:"Thank you"
    },
    {
      type: "sender",
      message:"weatherupdates"
    },
    {
      type: "reciever",
      message:"Are you interested?"
    },
    {
      type: "sender",
      message:"1"
    },
    {
      type: "reciever",
      message:"Send us a voice note to tell us in which village or town name" // add voice note later
  },
  {
    type: "sender",
    attachment:"Audio"
    }
];
  
export const leafCurlFlowMessages = [
  {
    type: "sender",
    message: "leafcurlcheck"
  },
  {
    type: "reciever",
    message: "Hi, Are you seeing any leaf curl symptoms like yellowing of leaves, or wilting in your Chilli crop ?"
  },
  {
    type: "sender",
    message: "1"
  },
  {
    type: "reciever",
    message: "Get the details from state change from web hook"
  },
  {
    type: "sender",
    message: "1"
  },
  {
    type: "reciever",
    message: "You can also watch this you tube link for more details."
  },
  {
    type: "sender",
    message: "cropcheckexpert"
  },
  {
    type: "reciever",
    message: "We can also have experts looks at your crop and give you advice."
  },

];

export const curativeFlowMessages = [
  {
    type: "sender",
    message:"curativeflow"
  },
  {
    type: "reciever",
    message:"Please share images of the impacted crop."
  },
  {
    type: "sender",
    attachment:"Image"
  },
  


];
