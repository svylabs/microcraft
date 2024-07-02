import React, { useState } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

const JsonViewer: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>({});
  const [jsonInput, setJsonInput] = useState<string>('{}');
  const [error, setError] = useState<string | null>(null);

  const handleJsonInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setJsonInput(input);

    try {
      const parsedJson = JSON.parse(input);
      setJsonData(parsedJson);
      setError(null);
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const handleEdit = (edit: InteractionProps) => {
    const { updated_src } = edit;
    setJsonData(updated_src);
    setJsonInput(JSON.stringify(updated_src, null, 2));
  };

  const handleAdd = (add: InteractionProps) => {
    const { updated_src } = add;
    setJsonData(updated_src);
    setJsonInput(JSON.stringify(updated_src, null, 2));
  };

  const handleDelete = (del: InteractionProps) => {
    const { updated_src } = del;
    setJsonData(updated_src);
    setJsonInput(JSON.stringify(updated_src, null, 2));
  };

  return (
    <div>
      <h1>JSON Viewer</h1>
      <textarea
        value={jsonInput}
        onChange={handleJsonInputChange}
        rows={10}
        cols={50}
        style={{ width: '100%' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ReactJson
        src={jsonData}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default JsonViewer;
