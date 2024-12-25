import React from 'react';
import { Modal, Rate } from 'antd';

const ViewIndicator = ({ visible, onClose }) => {
  const data = [
    {
      category: 'Behavioural Competencies',
      items: [
        { name: 'Business Process', rating: 4 },
        { name: 'Oral Communication', rating: 4 },
      ],
    },
    {
      category: 'Organizational Competencies',
      items: [
        { name: 'Leadership', rating: 3 },
        { name: 'Project Management', rating: 4 },
      ],
    },
    {
      category: 'Technical Competencies',
      items: [
        { name: 'Allocating Resources', rating: 2 },
      ],
    },
  ];

  return (
  <>
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <div className="mb-4">
        <p>
          <strong>Branch:</strong> China
          <span className="ml-4">
            <strong>Department:</strong> Financials
          </span>
          <span className="ml-4">
            <strong>Designation:</strong> Chartered
          </span>
        </p>
      </div>

      {data.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold text-lg mb-2">{section.category}</h3>
          {section.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <Rate disabled value={item.rating} />
            </div>
          ))}
        </div>
      ))}

</>
  );
};

export default ViewIndicator;
