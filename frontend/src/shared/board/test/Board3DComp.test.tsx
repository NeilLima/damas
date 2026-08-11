import { render, screen } from '@testing-library/react';
import Board3DComp from '../components/Board3DComp';

describe('Board3DComp', () => {
  it('should render the board container', () => {
    render(<Board3DComp />);
    expect(screen.getByText(/Peças no tabuleiro/i)).toBeInTheDocument();
  });
});