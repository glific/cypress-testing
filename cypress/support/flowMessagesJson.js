export const messages = [
  {
    type: "sender",
    text: "hi",
  },
  {
    type: "receiver",
    text: "👋 హలో",
  },

  {
    type: "receiver",
    text: "డిజిటల్ గ్రీన్ సంస్థ గురించి క్లుప్తంగా తెలుసుకోవడానికి మీకోసం ఈ వీడియో",
  },
  {
    type: "receiver",
    text: "Above image shows the Chilli crop infected with leaf curl at different stages of the crop. If your crop looks like any of these it might be affected with Leaf Curl and you should take our advisory service to cure and manage. ",
  },
  {
    type: "receiver",
    text: "పై వీడియో ద్వారా మీరు సులభంగా వాయిస్ నోట్ ఎలా పంపాలో తెలుసుకోవచ్చు",
  },
  {
    type: "sender",
    attachment: {
      type: "AUDIO",
      url: "https://filemanager.gupshup.io/fm/wamedia/DigitalGreenBot/d78cb90f-f62f-40e1-9108-f9ebd890514c",
    },
    wait: 5000,
  },
  {
    type: "receiver",
    text: "You said",
  },
  {
    type: "reciever",
    text: "We wish to send you advisory, based on the current stage of your Chilli crop🌶️.",
  },
];

export const leafCurlFlowtexts = [
  {
    type: "sender",
    text: "leafcurlcheck",
  },
  {
    type: "reciever",
    text: "Hi, Are you seeing any leaf curl symptoms like yellowing of leaves, or wilting in your Chilli crop ?",
  },
  {
    type: "sender",
    text: "1",
  },
  {
    type: "reciever",
    text: "Get the details from state change from web hook",
  },
  {
    type: "sender",
    text: "1",
  },
  {
    type: "reciever",
    text: "You can also watch this you tube link for more details.",
  },
  {
    type: "sender",
    text: "cropcheckexpert",
  },
  {
    type: "reciever",
    text: "We can also have experts looks at your crop and give you advice.",
  },
];

export const curativeFlowtexts = [
  {
    type: "sender",
    text: "curativeflow",
  },
  {
    type: "reciever",
    text: "Please share images of the impacted crop.",
  },
  {
    type: "sender",
    attachment: "Image",
  },
];
