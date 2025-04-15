import { Button, Form, Select } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { Doctor } from "../../types/doctor";
import DoctorService from "../../services/doctor-service";

export interface CreateQueueFormValues {
  doctorId: number
}

interface CreateQueueFormProps {
  createQueue: (values: CreateQueueFormValues) => Promise<void>
  clinicId: number
}

const CreateQueueForm = ({ createQueue, clinicId }: CreateQueueFormProps): ReactElement => {
  const [ form ] = Form.useForm<CreateQueueFormValues>();
  const [ clinicDoctors, setClinicDoctors ] = useState<Doctor[]>([]);

  const fetchDoctors = async () => {
    const doctors = await DoctorService.findDoctors({ clinicId });
    setClinicDoctors(doctors);
  };

  const getDoctorsOption = (doctors: Doctor[]): ReactElement[] => {
    const options = [];
    doctors.forEach((doctor: Doctor) => {
      options.push(
        <Select.Option key={doctor.id} value={doctor.id}>
          DR {doctor.lastName.toUpperCase()} {doctor.firstName.toUpperCase()}</Select.Option>
      );
    });
    return options;
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return <Form
    name="create_new_queue"
    layout="inline"
    form={form}
    onFinish={createQueue}
    requiredMark={false}
  >
    <Form.Item
      name="doctorId"
      rules={[ { required: true, message: "Select the queue doctor" } ]}
    >
      <Select
        placeholder="Please select the doctor"
        style={{ width: "200px" }}
      >
        ...{getDoctorsOption(clinicDoctors)}
      </Select>
    </Form.Item>
    <Form.Item shouldUpdate>
      {() => (
        <Button
          data-testid='create-queue-button'
          htmlType="submit"
          disabled={
            !form.isFieldsTouched(true) ||
            !!form.getFieldsError().filter(({ errors }) => errors.length).length
          }>
          Create Queue
        </Button>
      )}
    </Form.Item>
  </Form>;
};

export default CreateQueueForm;
