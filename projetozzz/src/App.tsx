import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { ProposalView } from './pages/ProposalView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/proposta/:id" element={<ProposalView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
