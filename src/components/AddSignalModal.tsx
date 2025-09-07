import React, { useState, useCallback } from 'react';
import { Modal, Button } from './index';
import { useSignalsContext } from '../contexts';
import { useBrandsContext } from '../contexts';
import type { CreateSignalForm, CopilotType, BrandId } from '../types/enhanced';

interface AddSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Use cases for different copilot types
const USE_CASES: Record<CopilotType, Array<{ name: string; prompt: string }>> = {
  'Market Research': [
    { name: 'Sustainable Technology Trends', prompt: 'Analyze market trends and consumer behavior patterns for sustainable technology products. Focus on social media sentiment, search volume, and competitor activity.' },
    { name: 'Healthcare Tech Opportunities', prompt: 'Research emerging market opportunities in the healthcare technology sector. Identify key trends, consumer needs, and competitive landscape.' },
    { name: 'Eco-Friendly Packaging Demand', prompt: 'Monitor market demand for eco-friendly packaging solutions. Track consumer preferences, regulatory changes, and competitor innovations.' }
  ],
  'Social Media': [
    { name: 'Brand Sentiment Monitoring', prompt: 'Monitor social media sentiment for our brand across Twitter, Facebook, and Instagram. Track mentions, sentiment changes, and identify potential PR issues or opportunities.' },
    { name: 'Competitor Social Strategy', prompt: 'Analyze competitor social media strategies and engagement rates. Identify successful content types and posting patterns.' },
    { name: 'Hashtag Performance Tracking', prompt: 'Track hashtag performance and trending topics related to our industry. Identify opportunities for content creation and engagement.' }
  ],
  'Competitive Analysis': [
    { name: 'Competitor Product Launches', prompt: 'Track competitor product launches, pricing changes, marketing campaigns, and market positioning. Alert on significant competitive moves that could impact our market share.' },
    { name: 'Website Change Monitoring', prompt: 'Monitor competitor website changes, new features, and content updates. Identify strategic shifts and new market entries.' },
    { name: 'Customer Review Analysis', prompt: 'Analyze competitor customer reviews and feedback across platforms. Identify their strengths, weaknesses, and areas for improvement.' }
  ],
  'Brand Monitoring': [
    { name: 'Brand Mention Tracking', prompt: 'Monitor brand mentions across all digital channels. Track sentiment, identify influencers, and detect potential reputation issues.' },
    { name: 'Brand Awareness Metrics', prompt: 'Track brand awareness metrics and share of voice in our industry. Compare performance against competitors.' },
    { name: 'IP Protection Monitoring', prompt: 'Monitor unauthorized use of brand assets, trademarks, and intellectual property across the web.' }
  ],
  'Consumer Insights': [
    { name: 'Product Feedback Analysis', prompt: 'Analyze consumer feedback and reviews to identify product improvement opportunities. Track satisfaction trends and common pain points.' },
    { name: 'Consumer Behavior Research', prompt: 'Research consumer preferences and buying behavior patterns. Identify demographic trends and market segments.' },
    { name: 'Feature Request Monitoring', prompt: 'Monitor consumer discussions about our products and services. Identify feature requests and improvement suggestions.' }
  ]
};

const AddSignalModal: React.FC<AddSignalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createSignal } = useSignalsContext();
  const { brands } = useBrandsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateSignalForm>({
    name: '',
    prompt: '',
    brandId: '' as BrandId,
    copilotType: 'Market Research',
    tags: [],
  });
  const [promptMode, setPromptMode] = useState<'predefined' | 'custom'>('predefined');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');

  const handleInputChange = useCallback((field: keyof CreateSignalForm, value: string | BrandId | CopilotType | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleUseCaseSelect = useCallback((useCaseName: string) => {
    setSelectedUseCase(useCaseName);
    const useCases = USE_CASES[formData.copilotType];
    const selectedUseCaseData = useCases.find(uc => uc.name === useCaseName);
    if (selectedUseCaseData) {
      setFormData(prev => ({
        ...prev,
        prompt: selectedUseCaseData.prompt,
      }));
    }
  }, [formData.copilotType]);

  const handlePromptModeChange = useCallback((mode: 'predefined' | 'custom') => {
    setPromptMode(mode);
    if (mode === 'custom') {
      setSelectedUseCase('');
      setFormData(prev => ({
        ...prev,
        prompt: '',
      }));
    } else {
      // Reset to first use case when switching to predefined
      const useCases = USE_CASES[formData.copilotType];
      if (useCases.length > 0) {
        setSelectedUseCase(useCases[0].name);
        setFormData(prev => ({
          ...prev,
          prompt: useCases[0].prompt,
        }));
      }
    }
  }, [formData.copilotType]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.prompt.trim() || !formData.brandId) {
      setError('Name, prompt, and brand are required fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await createSignal(formData);
      
      // Reset form
      setFormData({
        name: '',
        prompt: '',
        brandId: '' as BrandId,
        copilotType: 'Market Research',
        tags: [],
      });
      setSelectedUseCase('');
      setPromptMode('predefined');
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create signal');
    } finally {
      setIsLoading(false);
    }
  }, [formData, createSignal, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData({
        name: '',
        prompt: '',
        brandId: '' as BrandId,
        copilotType: 'Market Research',
        tags: [],
      });
      setSelectedUseCase('');
      setPromptMode('predefined');
      setError(null);
      onClose();
    }
  }, [isLoading, onClose]);

  const currentUseCases = USE_CASES[formData.copilotType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Signal"
      size="xl"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="space-y-6">
          {/* Signal Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Signal Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter signal name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Brand Selection */}
          <div>
            <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
              Brand *
            </label>
            <select
              id="brandId"
              value={formData.brandId}
              onChange={(e) => handleInputChange('brandId', e.target.value as BrandId)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isLoading}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Copilot Type */}
          <div>
            <label htmlFor="copilotType" className="block text-sm font-medium text-gray-700 mb-1">
              Copilot Type *
            </label>
            <select
              id="copilotType"
              value={formData.copilotType}
              onChange={(e) => handleInputChange('copilotType', e.target.value as CopilotType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isLoading}
            >
              {Object.keys(USE_CASES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prompt Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="promptMode"
                  value="predefined"
                  checked={promptMode === 'predefined'}
                  onChange={(e) => handlePromptModeChange(e.target.value as 'predefined' | 'custom')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Predefined Use Cases</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="promptMode"
                  value="custom"
                  checked={promptMode === 'custom'}
                  onChange={(e) => handlePromptModeChange(e.target.value as 'predefined' | 'custom')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Custom Prompt</span>
              </label>
            </div>
          </div>

          {/* Conditional Content Based on Prompt Mode */}
          {promptMode === 'predefined' ? (
            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1">
                Use Case *
              </label>
              <select
                id="useCase"
                value={selectedUseCase}
                onChange={(e) => handleUseCaseSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isLoading}
              >
                <option value="">Select a use case</option>
                {currentUseCases.map((useCase, index) => (
                  <option key={index} value={useCase.name}>
                    {useCase.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt *
              </label>
              <textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your custom prompt"
                required
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Signal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSignalModal;
