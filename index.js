const express = require('express');
const app = express();
const port = 3000;

const patient = [
    {
        name: 'Mukund jha',
        kidneys: [
            {
                id: 1,
                healthy: false
            }
        ]
    }
];
var patient_Id = 1;

app.use(express.json());


app.get('/', function (req, res) {
    const total_patient = patient[0].kidneys;
    
  
    const total_healthy_patient = total_patient.filter(kidney => kidney.healthy).length;
    const total_unhealthy_kidneys = total_patient.filter(kidney => !kidney.healthy).length;
    
    res.json({
        patient_id: patient_Id,
        total_patient: total_patient.length,
        total_healthy_patient,
        total_unhealthy_kidneys
    });
});


app.post('/patient', function (req, res) {
    const is_healthy = req.body.is_healthy;


    patient_Id++; 
    patient[0].kidneys.push({
        id: patient_Id,
        healthy: is_healthy
    });

    res.status(200).json({
        msg: 'Successfully added!',
        new_kidney: {
            id: patient_Id,
            healthy: is_healthy
        }
    });
});


app.put('/update/:patient_Id', function (req, res) {
    const patient_id = parseInt(req.params.patient_Id); 
    const { ishealthy } = req.body; 
    
    
    const kidney = patient[0].kidneys.find(kidney => kidney.id === patient_id);

    if (!kidney) {
        return res.status(404).json({ msg: 'Kidney not found.' });
    }

   
    kidney.healthy = ishealthy;

    res.status(200).json({
        msg: 'Kidney status updated successfully!',
        updated_kidney: kidney
    });
});

app.delete('/delete/:patient_Id',function(req,res){
    const healthy_id = parseInt(req.params.patient_Id)
    console.log(healthy_id)

    const kidney_index = patient[0].kidneys.findIndex(kidney=> kidney.id === healthy_id)

    if(kidney_index === -1)
    {
        return res.status(404).json({ msg: 'Kidney not found.' });
    }

    patient[0].kidneys.splice(kidney_index, 1);

    res.status(200).json({
        msg: 'Kidney deleted successfully!'
    });
})
app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
});
