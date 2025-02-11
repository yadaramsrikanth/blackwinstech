Setup and Running the Application:

        1.git clone <repository url>
        2.npm install
        3. npm start


 API Endpoints Overview:

      I.GET all contacts
              End Point: GET/contacts/
              Request:   https://blackwinstech-dolj.onrender.com/contacts/      
              Response :    {"contactsList": [{"contact_id": 3,"name": "anil kumar","email": "anilkumar@gmail.com","phone_number": "9876543210","created_at": "2025-02-10 18:07:38"},{"contact_id": 4,"name": "tarun","email": "tarunkumar@gmail.com","phone_number": "9876543200","created_at": "2025-02-11 05:26:34"},]}

      II.Get Contact by ID
              End Point: GET/contacts/:id
              Request: https://blackwinstech-dolj.onrender.com/contacts/5
              Response: {"contactItem":{"contact_id":5,"name":"srinu","email":"srinu@gmail.com","phone_number":"9076543200","created_at":"2025-02-11 05:28:47"}}
              Error Response (if ID is invalid or not found):  { "error": "Contact not found" }
      
      III.Add a New Contact  
              End Point: POST/contacts
              Request: https://blackwinstech-dolj.onrender.com/contacts/ ; method: POST, "Content-Type": "application/json", body:JSON.stringify({"name": "Alice Smith","email": "alice@example.com","phone_number": "5551234567"})
              Response: {"newContact": {"contact_id": 8,"name": "srikanthy","email": "srikanth@gmail.com","phone_number": "7474747474","created_at": "2025-02-11 09:58:44"}}

     IV. Update a Contact

               End Point:PUT /contacts/:id
               Request:https://blackwinstech-dolj.onrender.com/contacts/id ; method: PUT, "Content-Type": "application/json", body:JSON.stringify({"name": "Alice Smith","email": "alice@example.com","phone_number": "5551234567"})
               Response:{ "message": "Contact updated successfully" }
              Error Response (if ID is invalid or not found):  { "error": "Contact not found" }
    
    V. Delete a Contact
    
              End Point:DELETE /contacts/:id
              Request: https://blackwinstech-dolj.onrender.com/contacts/id
              Response:{ "message": "Contact deleted successfully" }
              Error Response (if ID is invalid or not found):  { "error": "Contact not found" }

              


            
         
        
