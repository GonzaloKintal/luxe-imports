import { FaShoppingCart } from 'react-icons/fa';

// Función para renderizar contenido Lexical con formato
function renderLexicalContent(lexicalJson) {
  if (!lexicalJson) return null;
  
  try {
    const parsed = JSON.parse(lexicalJson);
    const children = parsed.root?.children || [];
    
    return children.map((node, nodeIndex) => {
      if (node.type === 'paragraph') {
        const content = node.children?.map((child, childIndex) => {
          if (child.type === 'text') {
            let text = child.text || '';
            
            // Aplicar formato según las propiedades
            if (child.format & 1) { // Bold
              text = <strong key={childIndex}>{text}</strong>;
            }
            if (child.format & 2) { // Italic
              text = <em key={childIndex}>{text}</em>;
            }
            
            return text;
          }
          return child.text || '';
        }) || [];
        
        return <p key={nodeIndex} className="mb-2">{content}</p>;
      }
      
      if (node.type === 'list') {
        const listItems = node.children?.map((item, itemIndex) => {
          const itemContent = item.children?.map((child, childIndex) => {
            if (child.type === 'text') {
              let text = child.text || '';
              if (child.format & 1) text = <strong key={childIndex}>{text}</strong>;
              if (child.format & 2) text = <em key={childIndex}>{text}</em>;
              return text;
            }
            return child.text || '';
          }) || [];
          
          return <li key={itemIndex}>{itemContent}</li>;
        }) || [];
        
        return <ul key={nodeIndex} className="list-disc list-inside mb-2">{listItems}</ul>;
      }
      
      return null;
    });
  } catch {
    // Si no es JSON válido, devolver el texto tal como está
    return <p>{lexicalJson}</p>;
  }
}

export default function ProductInfo({
  product,
  cartInfo,
  cotizacion,
  loadingCotizacion,
  errorCotizacion,
  loadingAddToCart,
  onAddToCart
}) {
    
  const getCategoryName = (category) => {
    if (typeof category === 'object' && category?.name) {
      return category.name;
    }
    return category || '';
  };

  const formatPrice = (price, currency = 'USD') => {
    const locale = currency === 'USD' ? 'en-US' : 'es-AR';
    return price.toLocaleString(locale, { minimumFractionDigits: 2 });
  };

  const getPesosPrice = () => {
    if (loadingCotizacion) return 'Cargando cotización...';
    if (errorCotizacion) return errorCotizacion;
    if (!cotizacion) return 'Sin cotización';
    return `AR$ ${formatPrice(product.price * cotizacion, 'ARS')}`;
  };

  const cartQuantity = cartInfo.items[product._id] || 0;
  const isDisabled = product.stock === 0 || loadingAddToCart;
  const buttonText = product.stock > 0 
    ? (loadingAddToCart ? 'Agregando...' : 'Agregar al carrito')
    : 'Sin stock';

  return (
    <div className="p-6 lg:p-8 lg:border-l lg:border-gray-200">
      <div className="space-y-6">
        
        {/* Título y categoría */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>
          {product.category && (
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
              {getCategoryName(product.category)}
            </span>
          )}
        </div>

        {/* Precios */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="text-4xl font-bold text-gray-900">
            {getPesosPrice()}
          </div>
          <div className="text-xl text-gray-700">
            USD ${formatPrice(product.price)}
          </div>
          <div className="text-[12px] text-gray-400 mt-1">
            * Los precios en pesos argentinos se calculan automáticamente según la cotización oficial y pueden variar al momento de la compra.
          </div>
        </div>

        {/* Descripción */}
        {product.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Descripción
            </h3>
            <div className="text-gray-700 leading-relaxed">
              {renderLexicalContent(product.description)}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-sm text-gray-500">Stock:</span>
            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </p>
          </div>
        </div>

        {/* Estado del carrito */}
        {cartQuantity > 0 && (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <span className="text-sm text-gray-700">En tu carrito:</span>
            <span className="font-semibold text-gray-900">{cartQuantity} unidades</span>
          </div>
        )}

        {/* Botón agregar al carrito */}
        <button
          onClick={onAddToCart}
          disabled={isDisabled}
          className={`flex items-center justify-center cursor-pointer w-full py-3 px-6 rounded-lg font-semibold text-lg transition ${
            !isDisabled
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={loadingAddToCart ? { opacity: 0.6, pointerEvents: 'none' } : {}}
        >
          {product.stock > 0 ? (
            <span className="flex items-center gap-1">
              <FaShoppingCart className="text-xl mr-3" />
              {buttonText}
            </span>
          ) : (
            buttonText
          )}
        </button>

      </div>
    </div>
  );

}