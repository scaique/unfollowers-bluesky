import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Carregando() {
    return (
        <div className="fixed inset-0 bg-secundario/80 flex items-center justify-center">
            <div className="p-5 bg-primario text-secundario rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="mr-3">Carregando...</span>
                <div>
                  <FontAwesomeIcon icon={faSpinner} size="xl" spin />
                </div>
              </div>
              <span className="text-xs mt-2 block">
                (Isso pode levar um tempo.)
              </span>
            </div>
        </div>
    );
}